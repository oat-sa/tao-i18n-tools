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
 * Check if current AST node contains __ method call with specified name
 * @param {Object} node - AST node
 * @param {string} methodName - name of __ method
 * @returns {boolean}
 */
function checkIfI18nMethodCall (node, methodName) {
    return node.callee && node.callee.object && node.callee.object.name === '__' &&
        node.callee.property && node.callee.property.name === methodName;
}

/**
 * Converts the given source code into AST and returns with a set of strings wrapped in `__()`
 *
 * @param {string} fileContent - source code of the file
 * @param {string} fileName - Name of the file
 * @param {string} [relativeTo] - File context will be relative to this path
 * @returns {Map<string, Object[]>}
 */
module.exports = function extractMessages(fileContent, fileName, relativeTo) {
    const fileExt = path.extname(fileName);
    const strings = new Map();
    let ast;

    /**
     * Wrap JS file content in a script tag before parsing it because svelte.parse expects a valid svelte component
     *
     * If the fileContent is from a svelte component, remove <style> tag before converting to AST because svelte can not parse postCSS
     */
    if (fileExt === '.js') {
        ast = svelte.parse(`<script>${fileContent}</script>`);
    } else if (fileExt === '.svelte') {
        /**
         * Style tag should be removed, because it can contain scss or postcss, what cannot be parsed without extra plugin.
         * Any <svelte:head> wrapping a <style> must also be removed _first_.
         * The lines should be kept so that we do not modify the sourcemap.
         */
        let source = fileContent;

        const ignoreRegexes = [
            /<svelte:head+>(.|\n|\r)*<\/svelte:head+>/gm,
            /<style>(.|\n|\r)*<\/style>/gm
        ];
        ignoreRegexes.forEach(re => {
            const block = source.match(re);
            const removedLines = block ? block[0].split('\n').length : 0;
            source = source.replace(re, new Array(removedLines).join('\n'));
        });

        ast = svelte.parse(source);
    }

    svelte.walk(ast, {
        enter(node) {
            if (node.callee && node.callee.name === '__') {
                svelte.walk(node, {
                    enter() {
                        const { type, value } = node.arguments[0];
                        const context = {
                            file: relativeTo ? path.relative(relativeTo, fileName) : fileName,
                            line: node.loc.start.line
                        };
                        if (type === 'Literal') {
                            const key = [...strings.keys()].find((item) => item.msgid === value) || { msgid: value };
                            strings.set(key, [...(strings.get(key) || []), context]);
                        } else {
                            /* eslint-disable no-console */
                            console.warn(
                                `__ method was called with an unextractable non literal parameter at ${context.file}:${context.line}`
                            );
                        }
                        this.skip();
                    }
                });
            } else if (checkIfI18nMethodCall(node, 'p')) {
                svelte.walk(node, {
                    enter() {
                        const [singularKey, pluralKey] = node.arguments;
                        const context = {
                            file: relativeTo ? path.relative(relativeTo, fileName) : fileName,
                            line: node.loc.start.line
                        };

                        if (singularKey.type !== 'Literal' || pluralKey.type !== 'Literal') {
                            console.warn(
                                `__.p method was called with an unextractable non literal parameter at ${context.file}:${context.line}`
                            );
                        } else {
                            const key = [...strings.keys()].find((item) => item.msgid === singularKey.value) ||
                                {
                                    msgid: singularKey.value,
                                    msgid_plural: pluralKey.value
                                };
                            strings.set(key, [...(strings.get(key) || []), context]);
                        }
                        this.skip();
                    }
                });
            }
        }
    });

    return strings;
};
