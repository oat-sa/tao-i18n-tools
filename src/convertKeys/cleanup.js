/* eslint-disable no-console */
const PO = require('pofile');
const path = require('path');
const glob = require('glob');

const rootPath = path.resolve('../../../proctoring/apps/frontend/src');
const allPoPattern = path.join(rootPath, 'locale/**/messages.po');

const groupByPolyfill = (arr, callback) => {
    return arr.reduce((acc = {}, ...args) => {
        const key = callback(...args);
        acc[key] ??= [];
        acc[key].push(args[0]);
        return acc;
    }, {});
};

// a) remove duplicates in pos (lines with same msgid and msgstr)
// b) if msgstr is equal to msgid, remove it
glob(allPoPattern, {}, async function (err, fileNames) {
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
                    //cleanup msgstr if equal to msgid (only for en-US)
                    if (filename.includes('en-US')) {
                        otherPo.items.forEach(i => {
                            if (i.msgid_plural) {
                                return; //handle plurals manually
                            } else if (i.msgid === i.msgstr.join('')) {
                                i.msgstr = '';
                            }
                        });
                    }
                    //merge references of records with same msgid
                    Object.values(groupByPolyfill(otherPo.items, i => i.msgid)).forEach(sameMsgidArray => {
                        const mergedReferences = sameMsgidArray.map(i => i.references).flat();
                        sameMsgidArray.forEach(i => {
                            i.references = [...mergedReferences];
                        });
                        // duplicate check
                        const distinctMsgstrForMsgid = new Set(sameMsgidArray.map(i => i.msgstr.join('')));
                        if (distinctMsgstrForMsgid.size > 1) {
                            console.log('==== ', filename, ' ====================');
                            console.log(sameMsgidArray.map(i => ({ msgid: i.msgid, msgstr: i.msgstr.join('') })));
                        }
                    });
                    //leave only first of records with same msgid
                    otherPo.items = otherPo.items.filter(i => {
                        const firstNotEmptyOccurrence = otherPo.items.find(
                            ii => ii.msgid === i.msgid && ii.msgstr.join('').length
                        );
                        if (firstNotEmptyOccurrence) {
                            return i === firstNotEmptyOccurrence;
                        }

                        const firstOccurrence = otherPo.items.find(ii => ii.msgid === i.msgid);
                        return i === firstOccurrence;
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
