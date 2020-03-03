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

const writeKeysToFile = (text) => {
    const key = `msgid "${text}"\nmsgstr ""\n`;

    fs.readFile(potFilePath, 'utf8').then(data => {
        if(!data) {
            return fs.appendFile(potFilePath, key);
        } else if (data.indexOf(key) === -1) {
            console.log(`msgid "${key}"`);
            return fs.appendFile(potFilePath, key);
        }
    }).catch(err =>  console.error(err));
};

const extractStrings = (fileContent) => {
    const re = /<style>(.|\n|\r)*<\/style>/gm;
    const source = fileContent.replace(re, '');
    const ast = svelte.parse(source);
    const promises = [];

    svelte.walk(ast, {
        enter(node) {
            if (node.callee && node.callee.name === '__') {
                svelte.walk(node, {
                    enter() {
                        if(node.arguments[0].type === 'Literal') {
                            promises.push(writeKeysToFile(node.arguments[0].value));
                        }
                        this.skip();
                    }
                });
            }
        }
    });

    return Promise.all(promises);
};

fs.access(potFilePath).catch(() => {
    const dirPath = path.dirname(potFilePath);

    /**
     * Create the file if it doesn't exists
     */
    console.warn('Provided POT file not found, creating a new one at the given path');
    return fs.mkdir(dirPath, {recursive: true}).then(() => {
        return fs.writeFile(potFilePath, '');
    });
}).then(() => {
    /**
     * Going through all the svelte components and extracting strings wrapped in `__()` function
     */
    console.log('POT file found');
    glob(`${dirSearchPath}/**/*.svelte`, {ignore: ["**/node_modules/**", "./node_modules/**"]}, (err, files) => {
        files.forEach(file => {
            fs.readFile(file, 'utf8').then(fileContent => {
                return extractStrings(fileContent)
            });
        });
    });
});