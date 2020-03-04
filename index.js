/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2019 (original work) Open Assessment Technologies SA
 *
 */

const svelte = require('svelte/compiler');
const fs = require('fs').promises;
const glob = require('glob');
const path = require('path');

const args = process.argv.slice(2);
const dirSearchPath = args[0];
const potFilePath = args[1];

/**
 * Writes the strings to POT file
 *
 * Skips the duplicate strings
 *
 * @param {string} text
 * @param {string} fileName
 */
const writeStringsToFile = (text, fileName) => {
    const comment = `# ${fileName}`;
    const key = `msgid "${text}"\nmsgstr ""`;

    fs.readFile(potFilePath, 'utf8').then(data => {
        if(!data || data.indexOf(key) === -1) {
            return fs.appendFile(potFilePath, `${comment}\n${key}\n`);
        } else {
            console.log(`String "${text}" already exists, skipping`);
        }
    }).catch(err =>  console.error(err));
};

/**
 * Converts the file source to AST and extracts strings wrapped in `__()`
 *
 * @param {string} fileContent
 * @param {string} fileName
 * @returns {Promise<writeStringsToFile[]>}
 */
const extractStrings = (fileContent, fileName) => {
    const fileExt = path.extname(fileName);
    const promises = [];
    let ast;

    /**
     * Wrap JS file content in a script tag before parsing it because svelte.parse expects a valid svelte component
     *
     * If the fileContent is from a svelte component, remove <style> tag before converting to AST because svelte can not parse postCSS
     */
    if (fileExt === '.js') {
        ast = svelte.parse(`<script>${fileContent}</script>`);
    } else if(fileExt === '.svelte') {
        const re = /<style>(.|\n|\r)*<\/style>/gm;
        const source = fileContent.replace(re, '');
        ast = svelte.parse(source);
    }

    svelte.walk(ast, {
        enter(node) {
            if (node.callee && node.callee.name === '__') {
                svelte.walk(node, {
                    enter() {
                        const firstArg = node.arguments[0];
                        if(firstArg.type === 'Literal') {
                            promises.push(writeStringsToFile(firstArg.value, fileName));
                        }
                        this.skip();
                    }
                });
            }
        }
    });

    return Promise.all(promises);
};

/**
 * Accesses the POT file to  write the strings
 *
 * Create the POT file if it does not exist
 */
fs.access(potFilePath).catch(() => {
    const dirPath = path.dirname(potFilePath);
    console.warn('Provided POT file not found, creating a new one at the given path');

    // Create the file if it doesn't exist
    return fs.mkdir(dirPath, {recursive: true}).then(() => {
        return fs.writeFile(potFilePath, '');
    });
}).then(() => {
    console.log('POT file found');

    // Goes through all the svelte and JS files and extracting strings wrapped in `__()` function
    glob(`${dirSearchPath}/**/*.{svelte,js}`, {ignore: ["**/node_modules/**", "./node_modules/**"]}, (err, files) => {
        files.forEach(file => {
            const fileName = path.basename(file);

            fs.readFile(file, 'utf8').then(fileContent => {
                return extractStrings(fileContent, fileName);
            });
        });
    });
});