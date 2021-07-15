const createFilter = require('@rollup/pluginutils').createFilter;
const parsePoFile = require('../parsePoFile/parsePoFile');

module.exports = function po2I18next ({
    include,
    exclude
}) {
    const filter = createFilter(include, exclude);

    return {
        transform(originalCode, id) {
            if (id.slice(-3) !== '.po' || !filter(id)) {
                return;
            }

            const { translations, p11nRules } = parsePoFile(originalCode);

            return {
                code: `export default ${translations}; export const p11nRules = ${p11nRules}`,
                map: { mappings: '' }
            };
        }
    };
};
