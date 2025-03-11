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

const extractMessages = require('../extractMessages.js');
const fs = require('fs').promises;
const path = require('path');

let jsFileContent;
let svelteFileContent;
let svelte5FileContent;

beforeAll(() =>
    Promise.all([
        fs.readFile(path.join(__dirname, 'data', 'dummy.js'), 'utf8').then(src => (jsFileContent = src)),
        fs.readFile(path.join(__dirname, 'data', 'dummy.svelte'), 'utf8').then(src => (svelteFileContent = src)),
        fs
            .readFile(path.join(__dirname, 'data', 'dummy-svelte5.svelte'), 'utf8')
            .then(src => (svelte5FileContent = src))
    ])
);

describe('API', () => {
    it('should exist', function () {
        expect(extractMessages).toBeDefined;
    });

    it('should be a function', function () {
        expect(extractMessages).toBeInstanceOf(Function);
    });
});

describe('extractMessages returns right number of messages with JavaScript and Svelte files', () => {
    it('should return a set of stings', function () {
        const strings = extractMessages(jsFileContent, 'dummy.js');
        const strings2 = extractMessages(svelteFileContent, 'dummy.svelte');
        const strings3 = extractMessages(svelte5FileContent, 'dummy-svelte5.svelte');

        expect(strings).toBeInstanceOf(Map);
        expect(strings).toMatchSnapshot();
        expect(strings2).toBeInstanceOf(Map);
        expect(strings2).toMatchSnapshot();
        expect(strings3).toBeInstanceOf(Map);
        expect(strings3).toMatchSnapshot();
    });
});
