const extractMessages = require('../extractMessages.js');
const fs = require('fs');

const globalDatabase = makeGlobalDatabase();


beforeAll(() => {
    globalDatabase.insert({'jsFileContent': fs.readFileSync(__dirname + '/test.js', 'utf8')});
    globalDatabase.insert({'svelteFileContent': fs.readFileSync(__dirname + '/test.svelte', 'utf8')});
});

afterEach(() => {
    cleanUpDatabase(globalDatabase);
});

describe('extractMessages', () => {
    it('should exist', function() {
        expect(extractMessages).toBeDefined;
    });

    it('should be a function', function() {
        expect(extractMessages).toBeInstanceOf(Function);
    });

    it('should return a set of stings', function() {
        globalDatabase.find('jsFileContent', (res) => {console.log(res)});
    });
});