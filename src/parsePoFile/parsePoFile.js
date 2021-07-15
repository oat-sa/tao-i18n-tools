const pofile = require('pofile');

module.exports = function parsePoFile (content) {
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
};
