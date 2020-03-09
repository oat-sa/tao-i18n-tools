const generatePOT = require('../generatePOT.js');
const fs = require('fs');

let strings;
let potContent;

beforeAll(() => {
    strings = new Set(['All work is done!', 'You have no more pending tasks for now!', 'Logout']);
    potContent = fs.readFileSync(__dirname + '/dummy.pot', 'utf8');
});

afterAll(() => {
    strings = null;
});

describe('API', () => {
    it('should exist', function() {
        expect(generatePOT).toBeDefined;
    });

    it('should be a function', function() {
        expect(generatePOT).toBeInstanceOf(Function);
    });
});

describe('generatePOT', () => {
    it('should return right POT content', function() {
        const generatePotContent = generatePOT(strings);

        expect(generatePotContent).toEqual(potContent);
    });
});