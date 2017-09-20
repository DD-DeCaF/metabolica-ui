import {Clipboard} from '../clipboard.module';

const clipboardRegistry = {
    author: {
        name: 'Author',
        pluralName: 'Authors'
    },
    book: {
        name: 'Book',
        pluralName: 'Books'
    },
};

const author1 = 'Uri Alon';
const author2 = 'Bernhard O. Palsson';

const book1 = {
    name: 'An Introduction to Systems Biology: Design Principles of Biological Circuits',
    author: author1,
};

const book2 = {
    name: 'Phosphate In Pediatric Health And Disease',
    author: author1,
};

const book3 = {
    name: 'Systems Biology: Properties of Reconstructed Networks ',
    author: author2
};

const book4 = {
    name: 'Systems Biology: Simulation of Dynamic Network States',
    author: author2
};

const book5 = {
    name: 'Systems Biology: Constraint-Based Reconstruction and Analysis',
    author: author2
};

describe('Clipboard', () => {
    it('Should be empty when created', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        expect(clipboard.isEmpty()).toBe(true);
    });

    it('Should be able to add items of registered type', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        expect(clipboard.canAdd('author')).toBe(true);

        clipboard.add('author', author1);
        expect(clipboard.items.length).toBe(1);

        clipboard.add('book', book1);
        expect(clipboard.items.length).toBe(2);

        clipboard.add('book', book2);
        expect(clipboard.items.length).toBe(3);
    });

    it('Should not be able to add items of unregistered type', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        expect(clipboard.canAdd('unknownType')).toBe(false);
    });

    it('Registered hooks should be triggered whenever clipboard changes', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        // this would be increased whenever a change occurs in the clipboard
        let changeCounter = 0;
        const hookFn = function () {
            changeCounter += 1;
        };

        // register a hook for change event on clipboard
        clipboard.onChange(hookFn);

        // An item is added, it's a change in the clipboard, hooks listening for change should be triggered.
        clipboard.add('author', author1);
        expect(changeCounter).toBe(1);

        // Another item is added, it's a change in the clipboard, hooks listening for change should be triggered.
        clipboard.add('book', book1);
        expect(changeCounter).toBe(2);

        // An item is removed, it's a change in the clipboard, hooks listening for change should be triggered.
        clipboard.remove('author', author1);
        expect(changeCounter).toBe(3);

        // It was already removed, it's not a change in the clipboard, hooks listening for change should not be
        // triggered.
        clipboard.remove('author', author1);
        expect(changeCounter).toBe(3);

        // Duplicates are allowed, it's allowed so a change in the clipboard, hooks listening for change should be
        // triggered.
        clipboard.add('book', book1);
        expect(changeCounter).toBe(4);
        clipboard.add('book', book1);
        expect(changeCounter).toBe(5);

        // There are some items on the clipboard, so clearing them is a change in the clipboard, hooks listening for
        // change should be triggered.
        clipboard.clear();
        expect(changeCounter).toBe(6);

        // There are no items on the clipboard, clearing the clipboard is not a change, hooks listening for
        // change should not be triggered.
        clipboard.clear();
        expect(changeCounter).toBe(6);
    });


    it('Unregistered hooks should be triggered whenever clipboard changes', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        // this would be increased whenever a change occurs in the clipboard
        let changeCounter = 0;
        const hookFn = function () {
            changeCounter += 1;
        };

        // register a hook for change event on clipboard
        clipboard.onChange(hookFn);

        // An item is added, it's a change in the clipboard, hooks listening for change should be triggered.
        clipboard.add('author', author1);
        expect(changeCounter).toBe(1);

        // Another item is added, it's a change in the clipboard, hooks listening for change should be triggered.
        clipboard.add('book', book1);
        expect(changeCounter).toBe(2);

        // An item is removed, it's a change in the clipboard, hooks listening for change should be triggered.
        clipboard.remove('author', author1);
        expect(changeCounter).toBe(3);

        // counter value should not be updated after hookFn has stopped listening for changes.
        clipboard.offChange(hookFn);
        clipboard.add(book2);
        expect(changeCounter).toBe(3);
        clipboard.add(book3);
        expect(changeCounter).toBe(3);
    });

    it('Same hook function cannot be registered multiple times for listening to clipboard changes', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        const hookFn = function () {
            // does nothing, it's a silent listener
        };

        // register a hook for change event on clipboard
        clipboard.onChange(hookFn);

        expect(clipboard.hooks.size).toBe(1);

        // register again
        clipboard.onChange(hookFn);
        expect(clipboard.hooks.size).toBe(1);
    });

    it('Should be able to get items by type', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        clipboard.add('author', author1);
        expect(clipboard.getItemsOfType('author').length).toBe(1);
        expect(clipboard.getItemsOfType('author')[0][0]).toBe('author');
        expect(clipboard.getItemsOfType('author')[0][1]).toBe(author1);

        clipboard.add('author', author2);
        expect(clipboard.getItemsOfType('author').length).toBe(2);

        expect(clipboard.getItemsOfType('book').length).toBe(0);

        expect(clipboard.getItemsOfType('unknownType').length).toBe(0);
    });

    it('Should be able to get items grouped by type', () => {
        const clipboard = new Clipboard(clipboardRegistry);

        clipboard.add('author', author1);
        clipboard.add('author', author2);
        clipboard.add('books', book2);
        clipboard.add('books', book3);
        clipboard.add('books', book1);
        clipboard.add('books', book5);
        clipboard.add('books', book4);

        const itemsGroupedByType = clipboard.getItemsGroupedByType();

        expect(Object.keys(itemsGroupedByType).length).toBe(2);

        expect(itemsGroupedByType['author'].length).toBe(2);
        expect(itemsGroupedByType['books'].length).toBe(5);

        // items in a group should be in the same order as they were added
        expect(itemsGroupedByType['author'][0]).toBe(author1);
        expect(itemsGroupedByType['author'][1]).toBe(author2);
        expect(itemsGroupedByType['books'][0]).toBe(book2);
        expect(itemsGroupedByType['books'][1]).toBe(book3);
        expect(itemsGroupedByType['books'][2]).toBe(book1);
        expect(itemsGroupedByType['books'][3]).toBe(book5);
        expect(itemsGroupedByType['books'][4]).toBe(book4);
    });
});
