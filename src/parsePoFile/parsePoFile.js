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
 * Copyright (c) 2021 (original work) Open Assessment Technologies SA
 *
 */
const pofile = require('pofile');

/**
 * @param {String} content - .po file content as string
 * @returns {Object} - translations object, in following format:
 * ```
 * {  
 *   translations: { 
 *     "<msgctxt>.<msgid>": "message",
 *     "<msgctxt>.<msgid_plural>": [
 *        "message plural form 1",
 *        "message plural form 2",
 *        ...
 *        "message plural form n",
 *     ]
 *  },
 *  p1nnRules: "plural rules function"
 * }
 * ```
 * where msgctxt, msgid and msgid_plural are corresponding keys from the .po file (msgcxtx is optional)
 */
function parsePoFile (content) {
    const { headers, items: entries } = pofile.parse(content);

    let [p11nRules] = headers["Plural-Forms"].match(/plural=.+/);
    p11nRules = p11nRules.replace('plural=', '(n)=>');

    const result = entries.reduce((accumulator, currentEntry) => {
        const {
            msgid,
            msgid_plural,
            msgctxt,
            msgstr
        } = currentEntry;
        const [singularFormMsgstr] = msgstr;

        let keyPrefix = '';
        if (msgctxt) {
            keyPrefix += `${msgctxt}.`;
        }

        accumulator[keyPrefix + msgid] = singularFormMsgstr;

        if (msgid_plural) {
            accumulator[keyPrefix + msgid_plural] = msgstr;
        }

        return accumulator;
    }, {});

    return {
        translations: JSON.stringify(result),
        p11nRules
    };
}

module.exports = parsePoFile;
