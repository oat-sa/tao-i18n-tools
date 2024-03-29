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

const parsePoFile = require('../parsePoFile.js');
const poFileExampleContent = `
msgid ""
msgstr ""
"Project-Id-Version: \n"
"POT-Creation-Date: \n"
"PO-Revision-Date: \n"
"Last-Translator: \n"
"Language-Team: \n"
"Language: en_US\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"X-Generator: Poedit 2.3\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"

#: ../component/report/dropdownOptions.js:8
msgid "SINGULAR"
msgstr "Singular message"

#: ../component/report/dropdownOptions.js:8
msgctxt "CONTEXT"
msgid "SINGULAR"
msgstr "Singular message with context"

#: ../component/actionForm/ActionForm.svelte:278
#: ../component/actionForm/ActionForm.svelte:279
msgid "PLURAL_MESSAGE"
msgid_plural "PLURAL_MESSAGES"
msgstr[0] "Plural message"
msgstr[1] "Plural messages"
`;

const poFileExampleContentWoPluralForms = `
msgid ""
msgstr ""
"Project-Id-Version: \n"
"POT-Creation-Date: \n"
"PO-Revision-Date: \n"
"Last-Translator: \n"
"Language-Team: \n"
"Language: en_US\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"X-Generator: Poedit 2.3\n"

#: ../component/report/dropdownOptions.js:8
msgid "SINGULAR"
msgstr "Singular message"

#: ../component/report/dropdownOptions.js:8
msgctxt "CONTEXT"
msgid "SINGULAR"
msgstr "Singular message with context"

#: ../component/actionForm/ActionForm.svelte:278
#: ../component/actionForm/ActionForm.svelte:279
msgid "PLURAL_MESSAGE"
msgid_plural "PLURAL_MESSAGES"
msgstr[0] "Plural message"
msgstr[1] "Plural messages"
`;

describe('correctly parses .po files', () => {
    it('correctly parses messages into JSON', () => {
        const { translations } = parsePoFile(poFileExampleContent);
        expect(typeof translations).toBe('string');

        const asObject = JSON.parse(translations);

        expect(asObject['CONTEXT.SINGULAR']).toBe('Singular message with context');
        expect(asObject['SINGULAR']).toBe('Singular message');
        expect(asObject['PLURAL_MESSAGE']).toBe('Plural message');
        expect(asObject['PLURAL_MESSAGES']).toHaveLength(2);
        expect(asObject['PLURAL_MESSAGES'][0]).toBe('Plural message');
        expect(asObject['PLURAL_MESSAGES'][1]).toBe('Plural messages');
    });

    it('extracts p11nRules function as string from .po file content', () => {
        const { p11nRules } = parsePoFile(poFileExampleContent);
        expect(p11nRules).toBe('(n)=>(n != 1);');
    });

    it('falls back to default implementation of p11nRules if Plural-Forms header is missing', () => {
        const { p11nRules } = parsePoFile(poFileExampleContentWoPluralForms);
        expect(p11nRules).toBe('()=>0');
    });
});

module.exports = poFileExampleContent;
