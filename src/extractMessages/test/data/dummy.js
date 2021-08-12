export default () => {
    const dummyFunction = () => {
        const string1 = __('Some dummy © string');
        const string2 = __('duplicate string');
        const string3 = __('duplicate string');
        const string4 = __.p('Key', 'Plural key', 5);
        const string5 = __.p('Duplicate key', 'Duplicate plural key', 5);
        const string6 = __.p('Duplicate key', 'Duplicate plural key', 7);
    };
};
