/**
 * Writes the strings to POT file
 *
 * Skips the duplicate strings
 */
module.exports = function generatePOT(strings) {
    let potContent = '';

    strings.forEach(string => {
        const key = `msgid "${string}"\nmsgstr ""`;

        potContent = potContent + `${key}\n`;
    });

    return potContent;
};