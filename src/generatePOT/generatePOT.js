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
 * Copyright (c) 2020-2022 (original work) Open Assessment Technologies SA
 *
 */

/**
 * Writes the strings to POT file
 *
 * Removes the duplicate strings
 * @param {Map<Object, Object[]}
 * @returns {string}
 */
module.exports = function generatePOT(strings) {
    let potContent = '';

    const msgids = new Set(); // avoids duplicates
    const msgid_plurals = new Set();

    strings.forEach((contexts, meta) => {
        const messageContext = contexts.map(context => `#: ${context.file}:${context.line}`).join('\n');
        const metaString = Object.keys(meta).reduce((accumulator, key) => {
            accumulator += `${key} "${meta[key]}"\n`;
            return accumulator;
        }, '');

        // add entry if msgid or msgid_plural are new
        if ((meta.msgid && !msgids.has(meta.msgid)) || (meta.msgid_plural && !msgid_plurals.has(meta.msgid_plural))) {
            potContent += `${messageContext}\n${metaString}msgstr${meta.msgid_plural ? '[0]' : ''} ""\n`;
            if (meta.msgid) {
                msgids.add(meta.msgid);
            }
            if (meta.msgid_plural) {
                msgid_plurals.add(meta.msgid_plural);
            }
        }
    });

    return potContent;
};
