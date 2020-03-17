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
 * Copyright (c) 2020 (original work) Open Assessment Technologies SA
 *
 */

const svelte = require('svelte/compiler');
const path = require('path');

/**
 * Converts the given source code into AST and returns with a set of strings wrapped in `__()`
 *
 * @param fileContent - source code of the file
 * @param fileName - Name of the file
 * @returns {Set<string>}
 */
module.exports = function extractMessages(fileContent, fileName) {
    const fileExt = path.extname(fileName);
    const strings = new Set();
    let ast;

    /**
     * Wrap JS file content in a script tag before parsing it because svelte.parse expects a valid svelte component
     *
     * If the fileContent is from a svelte component, remove <style> tag before converting to AST because svelte can not parse postCSS
     */
    if (fileExt === '.js') {
        ast = svelte.parse(`<script>${fileContent}</script>`);
    } else if (fileExt === '.svelte') {
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
                        if (firstArg.type === 'Literal') {
                            strings.add(firstArg.value);
                        }
                        this.skip();
                    }
                });
            }
        }
    });

    return strings;
};
