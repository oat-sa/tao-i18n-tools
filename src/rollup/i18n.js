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
 * Copyright (c) 2020 (original work) Open Assessment Technologies SA ;
 */

const path = require('path');
const fs = require('fs');
const minimatch = require('minimatch');
const extractMessages = require('../extractMessages/extractMessages');
const generatePOT = require('../generatePot/generatePOT');

module.exports = (options = {}) => {
    if (typeof options.output !== 'string') {
        throw new Error('"output" have to be defined');
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
                extractMessages(source, id).forEach((context, message) => {
                    messages.set(message, [...(messages.get(message) || []), ...context]);
                });
            }
            return source;
        },
        buildEnd() {
            return fs.promises.writeFile(options.output, generatePOT(messages));
        }
    };
};
