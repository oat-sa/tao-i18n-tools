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

jest.mock('../../extractMessages/extractMessages', function() {
    return jest.fn(() => new Map([['hello', [{ file: 'index.js', line: 23 }]]]));
});

jest.mock('../../generatePOT/generatePOT', function() {
    return jest.fn(() => 'POT content');
});

jest.mock('fs', function() {
    return {
        promises: {
            writeFile: jest.fn(() => Promise.resolve())
        }
    };
});

const i18n = require('../i18n.js');
const extractMessages = require('../../extractMessages/extractMessages.js');
const generatePOT = require('../../generatePOT/generatePOT.js');
const fs = require('fs');

describe('i18n rollup API', () => {
    it('should exist', function() {
        expect(i18n).toBeDefined;
    });

    it('should be an object', () => {
        expect(i18n).toBeInstanceOf(Function);
    });

    it('should have name', () => {
        expect(typeof i18n({ output: '' }).name).toBe('string');
    });
});

describe('i18n', () => {
    it('calls extractMessages and generatePOT with correct parameters', () => {
        const output = '/src/locale/messages.pot';
        const instance = i18n({ output });
        const source = 'abc';
        const id = '/src/index.js';

        // extract messages
        expect(instance.transform(source, id)).toBe(null);
        expect(extractMessages).toHaveBeenCalledWith(source, id, '/src/locale');

        // generate POT
        expect(instance.buildEnd()).toBeInstanceOf(Promise);
        expect(generatePOT.mock.calls[0][0].get('hello')).toMatchObject([{ file: 'index.js', line: 23 }]);

        // write to disk
        expect(fs.promises.writeFile).toHaveBeenCalledWith(output, 'POT content');
    });
});
