/* eslint-disable no-console */
const PO = require('pofile');
const path = require('path');

const rootPath = path.resolve('../../../proctoring/apps/frontend/src');
const ptbrPoPath = path.join(rootPath, 'locale/pt-BR/messages.po');
const ptbrNewPoPath = path.join(rootPath, 'locale/pt-BR/messages-new.po');

// check which strings were wrongly removed
PO.load(ptbrPoPath, function (err, po) {
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

        PO.load(ptbrNewPoPath, function (err2, poNew) {
            if (err2) {
                console.error(err2);
                process.exit(1);
            } else {
                const mappedNewItems = new Map(
                    poNew.items
                        .map(i => [
                            i.msgid,
                            {
                                msgstr_new: i.msgstr.join(''),
                                msgstr_old: mappedItems.has(i.msgid) ? mappedItems.get(i.msgid).msgstr : ''
                            }
                        ])
                        .filter(
                            tuple =>
                                // (tuple[1].msgstr_new &&
                                //     tuple[1].msgstr_old &&
                                //     tuple[1].msgstr_new !== tuple[1].msgstr_old) ||
                                tuple[1].msgstr_new && !tuple[1].msgstr_old
                        )
                );
                console.log(mappedNewItems);
            }
        });
    }
});
