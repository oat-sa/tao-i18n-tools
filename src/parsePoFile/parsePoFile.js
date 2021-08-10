const pofile = require('pofile');

/**
 * @param {String} content - .po file content as string
 * @returns {Object} - translations object, in following format:
 * ```
 * {
 *   "<msgctxt>.<msgid>": "message",
 *   "<msgctxt>.<msgid_plural>": [
 *      "message plural form 1",
 *      "message plural form 2",
 *      ...
 *      "message plural form n",
 *   ]
 * }
 * ```
 * where msgctxt, msgid and msgid_plural are corresponding keys from the .po file (msgcxtx is optional)
 */
function parsePoFile (content) {
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
}

module.exports = parsePoFile;
