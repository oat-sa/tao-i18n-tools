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

const generatePOT = require('../generatePOT.js');

let strings;

beforeAll(() => {
    strings = new Map([
        ['All work is done!', [{ file: 'index.js', line: 13 }]],
        [
            'You have no more pending tasks for now!',
            [
                { file: '../src/controller/runner.js', line: 31 },
                { file: '../src/controller/runner.js', line: 45 }
            ]
        ],
        ['Logout', [{ file: '../../src/bootstrap.js', line: 22 }]]
    ]);
});

describe('API', () => {
    it('should exist', function () {
        expect(generatePOT).toBeDefined;
    });

    it('should be a function', function () {
        expect(generatePOT).toBeInstanceOf(Function);
    });
});

describe('generatePOT', () => {
    it('should return right POT content', function () {
        const generatePotContent = generatePOT(strings);

        expect(generatePotContent).toMatchSnapshot();
    });
});
