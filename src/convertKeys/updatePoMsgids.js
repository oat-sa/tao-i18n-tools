/* eslint-disable no-console */
const PO = require('pofile');
const path = require('path');
const glob = require('glob');

const rootPath = path.resolve('../../../proctoring/apps/frontend/src');
const engPoPath = path.join(rootPath, 'locale/en-US/messages.po');
const allPoPattern = path.join(rootPath, 'locale/**/messages.po');

//replace msgids in all *.po files with msgstr from eng-US po.
PO.load(engPoPath, function (err, po) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        const mappedItems = new Map(
            po.items.map(i => [
                i.msgid,
                {
                    msgid: i.msgid,
                    msgstr: i.msgstr.join('')
                }
            ])
        );

        glob(allPoPattern, {}, async function (er, fileNames) {
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
                            otherPo.items.forEach(i => {
                                if (i.msgid_plural) {
                                    return; //handle plurals manually
                                } else {
                                    if (mappedItems.get(i.msgid)) {
                                        //msgstr in en_US is empty for LDS keys: '1 day' or '%d hours'
                                        if (mappedItems.get(i.msgid).msgstr) {
                                            i.msgid = mappedItems.get(i.msgid).msgstr;
                                        }
                                    } else {
                                        console.log('NOT FOUND!', filename, i.msgid);
                                    }
                                }
                            });
                            otherPo.save(filename, function (err2) {
                                if (err2) {
                                    console.error(err2);
                                    process.exit(1);
                                } else {
                                    //continue
                                }
                            });
                        }
                    });
                }
            }
        });
    }
});
