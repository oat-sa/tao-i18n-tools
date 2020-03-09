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

const extractMessages = require('../extractMessages.js');
const fs = require('fs');
const path = require('path');

let jsFileContent;
let svelteFileContent;

beforeAll(() => {
    jsFileContent = fs.readFileSync(path.join(__dirname, 'dummy.js'), 'utf8');
    svelteFileContent = fs.readFileSync(path.join(__dirname, 'dummy.svelte'), 'utf8');
});

describe('API', () => {
    it('should exist', function() {
        expect(extractMessages).toBeDefined;
    });

    it('should be a function', function() {
        expect(extractMessages).toBeInstanceOf(Function);
    });
});

describe('extractMessages with JavaScript and Svelte files', () => {
    it('should return a set of stings', function() {
        const strings = extractMessages(jsFileContent, 'dummy.js');
        const strings2 = extractMessages(svelteFileContent, 'dummy.svelte');

        expect(strings).toBeInstanceOf(Set);
        expect(strings).toMatchSnapshot();
        expect(strings2).toBeInstanceOf(Set);
        expect(strings2).toMatchSnapshot();
    });

    it('extractMessages returns right number of messages after parsing files', function() {
        const strings = extractMessages(jsFileContent, 'dummy.js');
        const strings2 = extractMessages(svelteFileContent, 'dummy.svelte');

        expect(strings.size).toEqual(2); // Not 3 because duplicate strings are not generated
        expect(strings.size).toMatchSnapshot();
        expect(strings2.size).toEqual(4);
        expect(strings2.size).toMatchSnapshot();
    });
});