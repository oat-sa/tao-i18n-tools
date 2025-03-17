/* eslint-disable no-console */
const PO = require('pofile');
const path = require('path');
const glob = require('glob');

const rootPath = path.resolve('../../../proctoring/apps/frontend/src');
const allPoPattern = path.join(rootPath, 'locale/**/messages.po');
const oldEngPoPath = path.join(rootPath, 'locale-old/en-US/messages.po');

const capitalize = (msgstr, msgid) => {
    //if msgstr (but not msgid) has 2 capitals adjacent (at start)
    if (
        msgstr.slice(0, 2).toUpperCase() === msgstr.slice(0, 2) &&
        (msgid.slice(0, 2).toUpperCase() !== msgid.slice(0, 2) || msgid === 'IP adress')
    ) {
        const isMsgidCapitalized = msgid[0].toUpperCase() === msgid[0];
        if (isMsgidCapitalized) {
            return msgstr[0].toUpperCase() + msgstr.slice(1).toLowerCase();
        } else {
            return msgstr.toLowerCase();
        }
    }
    return msgstr;
};
const replaceUnderline = msgstr => {
    //underline, and 'abc-def' to 'abc def'
    return msgstr.replace(/_/g, ' ').replace(/([^\s])(-)([^\s])/g, '$1 $3');
};

// check which files contain msgstr in ABC_DEF format - try to update them manually
PO.load(oldEngPoPath, function (err, oldEngPo) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        let mappedOldEngItems = new Map(
            oldEngPo.items.map(i => [
                i.msgstr.join(''),
                {
                    msgid: i.msgid,
                    msgstr: i.msgstr.join('')
                }
            ])
        );

        glob(allPoPattern, {}, async function (err2, fileNames) {
            if (err2) {
                console.error(err2);
                process.exit(1);
            } else {
                for (const filename of fileNames) {
                    PO.load(filename, function (err1, po) {
                        if (err1) {
                            console.error(err1);
                            process.exit(1);
                        } else {
                            const mappedItems = po.items
                                .filter(i => i.msgstr.join('').length > 0 && !i.msgid_plural) //handle plurals manually
                                .map(i => ({
                                    msgid: i.msgid,
                                    msgid_old: mappedOldEngItems.has(i.msgid)
                                        ? mappedOldEngItems.get(i.msgid).msgid
                                        : null,
                                    msgstr: i.msgstr.join(''),
                                    msgstr_new: capitalize(replaceUnderline(i.msgstr.join('')), i.msgid)
                                }))
                                .filter(i => i.msgstr.length && i.msgstr !== i.msgstr_new);

                            console.log('====== ', filename, '=================================');
                            console.log(mappedItems);

                            po.items.forEach(i => {
                                const mappedItem = mappedItems.find(ii => ii.msgid === i.msgid);
                                if (mappedItem) {
                                    i.msgstr = [mappedItem.msgstr_new];
                                }
                            });
                            po.save(filename, function (err3) {
                                if (err3) {
                                    console.error(err3);
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
