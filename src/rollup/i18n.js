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
 * Copyright (c) 2020-2024 (original work) Open Assessment Technologies SA ;
 */

const path = require('path');
const fs = require('fs');
const { minimatch } = require('minimatch');
const extractMessages = require('../extractMessages/extractMessages');
const generatePOT = require('../generatePOT/generatePOT');

/**
 * Comparison function for sorting i18n message contexts
 * @param {Object} ctx1
 * @param {String} ctx1.file
 * @param {Number} ctx1.line
 * @param {Object} ctx2
 * @param {String} ctx2.file
 * @param {Number} ctx2.line
 * @returns {Number}
 */
function compareContexts(ctx1, ctx2) {
    if (ctx1.file > ctx2.file) {
        return 1;
    }
    if (ctx1.file < ctx2.file) {
        return -1;
    }
    return ctx1.line > ctx2.line ? 1 : 0;
}

/**
 * Rollup plugin - extracts i18n messages from a source codebase, and writes POT file as output
 * @param {Object} options
 * @returns {Object} Rollup plugin API
 */
module.exports = (options = {}) => {
    if (typeof options.output !== 'string') {
        throw new Error('"output" has to be defined');
    }
    options = Object.assign({ exclude: [], include: [] }, options);
    const messages = new Map();
    return {
        name: 'i18n',
        transform(source, id) {
            if (
                ['.js', '.svelte'].includes(path.extname(id)) &&
                (options.include.some(pattern => minimatch(id, pattern)) ||
                    !options.exclude.some(pattern => minimatch(id, pattern)))
            ) {
                extractMessages(source, id, path.dirname(options.output)).forEach((context, message) => {
                    const contexts = [...(messages.get(message) || []), ...context];
                    // sort by context file:line to have the same order everytime
                    messages.set(
                        message,
                        contexts.sort(compareContexts)
                    );
                });
            }
            return null;
        },
        buildEnd() {
            // sort the messages by first context's file:line to have the same order everytime
            const sortedMessages = new Map([...messages].sort((a, b) => {
                return compareContexts(a[1][0], b[1][0]);
            }));
            return fs.promises.writeFile(options.output, generatePOT(sortedMessages));
        }
    };
};
