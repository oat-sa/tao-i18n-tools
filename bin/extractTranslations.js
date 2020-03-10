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

const extractMessages = require('../src/extractMessages/extractMessages.js');
const generatePOT = require('../src/generatePOT/generatePOT.js');
const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');
const commander = require('commander');

const program = new commander.Command();

program.version('0.0.1');
program
    .option('-s, --source <type>', 'Path of source dir to search for strings to translate')
    .option('-d, --destination <type>', 'Path to destination POT file')
    .parse(process.argv);

console.log(JSON.stringify(program));
console.log(program.source);
console.log(program.destination);

const dirSearchPath = program.source;
const potFilePath = program.destination;

/**
 * This script Accepts src dir to extract translations and writes the in the dest POT file
 */
if(!dirSearchPath || !potFilePath) {
    console.error('Please provide source folder to search for strings and a destination POT file.');
} else {
    fs.access(potFilePath).catch(() => {
        const dirPath = path.dirname(potFilePath);
        console.warn('Provided POT file not found, creating a new one at the given path');

        // Create the file if it doesn't exist
        return fs.mkdir(dirPath, {recursive: true}).then(() => {
            return fs.writeFile(potFilePath, '');
        });
    }).then(() => {
        console.log('POT file found or created');

        // Goes through all the svelte and JS files and extracting strings wrapped in `__()` function
        glob(`${dirSearchPath}/**/*.{svelte,js}`, {ignore: ["**/node_modules/**", "./node_modules/**"]}, (err, files) => {
            Promise.all(files.map(file => {
                const fileName = path.basename(file);

                return fs.readFile(file, 'utf8').then(fileContent => {
                    return [...extractMessages(fileContent, fileName)];
                });
            })).then((stringSet) => {
                const strings = new Set([].concat(...stringSet));
                const content = generatePOT(strings);

                fs.writeFile(potFilePath, content).then(console.log('New Translations added successfully')).catch(err =>  console.error(err));
            });
        });
    });
}