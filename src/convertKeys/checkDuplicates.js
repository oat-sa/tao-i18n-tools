/* eslint-disable no-console */
const PO = require('pofile');
const path = require('path');
const glob = require('glob');

const rootPath = path.resolve('../../../proctoring/apps/frontend/src');
const oldEngPoPath = path.join(rootPath, 'locale-old/en-US/messages.po');
const oldAllPoPattern = path.join(rootPath, 'locale-old/**/messages.po');

const groupByPolyfill = (arr, callback) => {
    return arr.reduce((acc = {}, ...args) => {
        const key = callback(...args);
        acc[key] ??= [];
        acc[key].push(args[0]);
        return acc;
    }, {});
};

// old en-US po: check if several differnet msgids had same msgstr;
//   then of any, look for msgstrs for this msgid in other pos - are they different there?
PO.load(oldEngPoPath, function (err, po) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        let mappedItems = po.items
            .map(i => ({
                msgid: i.msgid,
                msgstr: i.msgstr.join('')
            }))
            .filter(i => i.msgstr);
        mappedItems = groupByPolyfill(mappedItems, i => i.msgstr);
        mappedItems = Object.values(mappedItems).filter(i => i.length > 1);
        //console.log(mappedItems);

        glob(oldAllPoPattern, {}, async function (er, fileNames) {
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
                            const otherPoItems = otherPo.items.map(i => ({
                                msgid: i.msgid,
                                msgstr: i.msgstr.join('')
                            }));
                            for (const mappedDuplicatesArray of Object.values(mappedItems)) {
                                let otherItemsByDupeMsgid = [];
                                for (const mappedItemWithSameMsgstrAndDifferentMsgid of mappedDuplicatesArray) {
                                    otherItemsByDupeMsgid.push(
                                        ...otherPoItems
                                            .filter(
                                                i =>
                                                    i.msgid === mappedItemWithSameMsgstrAndDifferentMsgid.msgid &&
                                                    i.msgstr
                                            )
                                            .map(i => {
                                                i.eng_us_msgstr = mappedItemWithSameMsgstrAndDifferentMsgid.msgstr;
                                                return i;
                                            })
                                    );
                                }
                                if (otherItemsByDupeMsgid.length > 1) {
                                    //are msgstrs which are equal in en-US [for different msgids], equal in other po too?
                                    const otherItemsForDupeMsgidGroupedByMsgstr = groupByPolyfill(
                                        otherItemsByDupeMsgid,
                                        i => i.msgstr
                                    );
                                    if (Object.keys(otherItemsForDupeMsgidGroupedByMsgstr).length > 1) {
                                        console.log('====== ', filename, '=================================');
                                        console.log(otherItemsByDupeMsgid);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});
