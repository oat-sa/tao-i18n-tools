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

const poFileExampleContent = require('../../parsePoFile/test/parsePoFile.spec.js');
const po2I18n = require('../po2i18n.js');

describe('Rollup plugin API', () => {
    it('should exist', () => {
        expect(po2I18n).toBeDefined;
    });

    it('should be a function', () => {
        expect(po2I18n).toBeInstanceOf(Function);
    });

    it('skips non .po files', () => {
        expect(po2I18n({}).transform(poFileExampleContent, 'index.js')).not.toBeDefined();
    });
});

describe('correclty handles po files', () => {
    it('returns string with module containing translations as object and p11nRules as function', () => {
        const code = po2I18n({}).transform(poFileExampleContent, 'somefile.po').code;
        expect(code).toBeDefined();
        expect(code).toMatchSnapshot();
    });
});