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

const generatePOT = require('../generatePOT.js');

let strings;

beforeAll(() => {
    strings = new Map([
        [
            {
                msgid: 'All work is done!'
            },
            [{ file: 'index.js', line: 13 }]],
        [
            {
                msgid: 'You have no more pending tasks for now!',
            },
            [{ file: '../src/controller/runner.js', line: 31 }, { file: '../src/controller/runner.js', line: 45 }]
        ],
        [
            {
                msgid: 'Logout'
            },
            [{ file: '../../src/bootstrap.js', line: 22 }]
        ],
        [
            {
                msgid: 'Remove test',
                msgid_plural: 'Remove tests'
            },
            [{ file: '../../src/bootstrap.js', line: 12 }]
        ],
        [
            {
                msgid: 'Remove test' // skip, as msgid duplicated
            },
            [{ file: '../../src/bootstrap-duplicates.js', line: 12 }]
        ],
        [
            {
                msgid: 'Remove test', // keep, as msgid duplicated but msgid_plural unique
                msgid_plural: 'Remove the tests'
            },
            [{ file: '../../src/bootstrap-duplicates.js', line: 123 }]
        ],
        [
            {
                msgid: 'Remove a test', // keep, as msgid_plural duplicated but msgid unique
                msgid_plural: 'Remove tests'
            },
            [{ file: '../../src/bootstrap-duplicates.js', line: 1234 }]
        ]
    ]);
});

describe('API', () => {
    it('should exist', function() {
        expect(generatePOT).toBeDefined;
    });

    it('should be a function', function() {
        expect(generatePOT).toBeInstanceOf(Function);
    });
});

describe('generatePOT', () => {
    beforeEach(() => {
        const start = new Date('2022-07-27');
        jest.spyOn(global, 'Date').mockImplementation(() => start);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return right POT content', function() {
        const generatePotContent = generatePOT(strings);

        expect(generatePotContent).toMatchSnapshot();
    });
});
