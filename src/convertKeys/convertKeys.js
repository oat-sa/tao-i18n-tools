/* eslint-disable no-console */
const PO = require('pofile');
const path = require('path');
const glob = require('glob');
const fsPromises = require('node:fs/promises');

const rootPath = path.resolve('../../../proctoring/apps/frontend/src');
const engPoPath = path.join(rootPath, 'locale/en-US/messages.po');
const srcPattern = path.join(rootPath, '**/*.*');

//replace "__('key')"" msgid keys in the source code with msgstr from en-US po
PO.load(engPoPath, function (err, po) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        const mappedItems = po.items
            .map(i => ({
                msgid: i.msgid,
                msgid_plural: i.msgid_plural ? 'handle plurals manually' : null,
                msgstr: i.msgstr.join('').replaceAll("'", "\\'"),
                regex: new RegExp(`(__\\(['"])(${i.msgid})(['"]\\))`, 'g')
            }))
            .filter(i => !i.msgid_plural);

        glob(srcPattern, { ignore: '**/*.{po,pot,snap}' }, async function (er, fileNames) {
            if (err) {
                console.error(err);
                process.exit(1);
            } else {
                for (const filename of fileNames) {
                    const originalFileContent = await fsPromises.readFile(filename, { encoding: 'utf8' });
                    let fileContent = originalFileContent;
                    for (const mappedItem of mappedItems) {
                        fileContent = fileContent.replace(mappedItem.regex, `$1${mappedItem.msgstr}$3`);
                    }
                    if (fileContent !== originalFileContent) {
                        await fsPromises.writeFile(filename, fileContent);
                    }
                }
            }
        });
    }
});
