/* eslint-disable no-console */
const PO = require('pofile');
const path = require('path');
const glob = require('glob');
const process = require('node:process');

const lookupMsgid = process.argv[2];
const rootPath = path.resolve('../../../proctoring/apps/frontend/src');
const oldAllPoPattern = path.join(rootPath, 'locale-old/**/messages.po');

console.log(lookupMsgid);

// list translations in all pos for this key
glob(oldAllPoPattern, {}, async function (err, fileNames) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        for (const filename of fileNames) {
            PO.load(filename, function (err1, otherPo) {
                if (err1) {
                    console.error(err1);
                    process.exit(1);
                } else {
                    const otherPoItems = otherPo.items
                        .map(i => ({
                            msgid: i.msgid,
                            msgstr: i.msgstr.join(''),
                            filename
                        }))
                        .filter(i => i.msgid === lookupMsgid && i.msgstr);

                    if (otherPoItems.length) {
                        console.log(otherPoItems);
                    }
                }
            });
        }
    }
});
