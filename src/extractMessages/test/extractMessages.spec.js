const extractMessages = require('../extractMessages.js');
const fs = require('fs');

let jsFileContent;
let svelteFileContent;

beforeAll(() => {
    jsFileContent = fs.readFileSync(__dirname + '/dummy.js', 'utf8');
    svelteFileContent = fs.readFileSync(__dirname + '/dummy.svelte', 'utf8');
});

afterAll(() => {
    jsFileContent = null;
    svelteFileContent = null;
});

describe('API', () => {
    it('should exist', function() {
        expect(extractMessages).toBeDefined;
    });

    it('should be a function', function() {
        expect(extractMessages).toBeInstanceOf(Function);
    });
});

describe('extractMessages with JavaScript and Svelte files', () => {
    it('should return a set of stings', function() {
        const strings = extractMessages(jsFileContent, 'dummy.js');
        const strings2 = extractMessages(svelteFileContent, 'dummy.svelte');

        expect(strings).toBeInstanceOf(Set);
        expect(strings2).toBeInstanceOf(Set);
    });

    it('Should find one message', function() {
        const strings = extractMessages(jsFileContent, 'dummy.js');
        const strings2 = extractMessages(svelteFileContent, 'dummy.svelte');

        expect(strings.size).toEqual(2); // Not 3 because duplicate strings are not generated
        expect(strings2.size).toEqual(4);
    });
});