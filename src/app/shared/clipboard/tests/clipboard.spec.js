import {Clipboard} from '../clipboard.module';

const clipboardRegistry = {
    parts: {
        name: 'Part',
        pluralName: 'Parts'
    }
};

describe('Clipboard', () => {
    it('Should be able to add parts', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        expect(clipboard.canAdd('parts')).toBe(true);
    });

    it('Should not be able to add random things', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        expect(clipboard.canAdd('somethingElse')).toBe(false);
    });
});
