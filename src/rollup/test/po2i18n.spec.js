const poFileExampleContent = require('../../parsePoFile/test/parsePoFile.spec');
const po2I18n = require('../po2i18n');

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