import {ClipboardProvider} from '../clipboard.module';

const author1 = {
    name: 'Uri Alon',
    $uri: '/api/authors/1'
};
const author2 = {
    name: 'Bernhard O. Palsson',
    $uri: '/api/authors/2'
};

const book1 = {
    name: 'An Introduction to Systems Biology: Design Principles of Biological Circuits',
    author: author1,
    $uri: '/api/books/1'
};

const book2 = {
    name: 'Phosphate In Pediatric Health And Disease',
    author: author1,
    $uri: '/api/books/2'
};

const book3 = {
    name: 'Systems Biology: Properties of Reconstructed Networks ',
    author: author2,
    $uri: '/api/books/3'
};

const book4 = {
    name: 'Systems Biology: Simulation of Dynamic Network States',
    author: author2,
    $uri: '/api/books/4'
};

const book5 = {
    name: 'Systems Biology: Constraint-Based Reconstruction and Analysis',
    author: author2,
    $uri: '/api/books/5'
};

describe('Clipboard', () => {
    let $clipboard;

    beforeEach(() => {
        const $clipboardProvider = new ClipboardProvider();

        $clipboardProvider.register('author', {
            name: 'Author',
            pluralName: 'Authors'
        });

        $clipboardProvider.register('book', {
            name: 'Book',
            pluralName: 'Books'
        });

        $clipboard = $clipboardProvider.$get();
    });

    it('Should be empty when created', () => {

        expect($clipboard.isEmpty()).toBe(true);
    });

    it('Should be able to add items of registered type', () => {
        expect($clipboard.canAdd('author')).toBe(true);

        $clipboard.add('author', author1);
        expect($clipboard.items.length).toBe(1);

        $clipboard.add('book', book1);
        expect($clipboard.items.length).toBe(2);

        $clipboard.add('book', book2);
        expect($clipboard.items.length).toBe(3);
    });

    it('Should not be able to add items of unregistered type', () => {
        expect($clipboard.canAdd('unknownType')).toBe(false);
    });

    it('Registered hooks should be triggered whenever clipboard changes', () => {
        // this would be increased whenever a change occurs in the clipboard
        let changeCounter = 0;
        const hookFn = function () {
            changeCounter += 1;
        };

        // register a hook for change event on clipboard
        $clipboard.onChange(hookFn);

        // An item is added, it's a change in the clipboard, hooks listening for change should be triggered.
        $clipboard.add('author', author1);
        expect(changeCounter).toBe(1);

        // Another item is added, it's a change in the clipboard, hooks listening for change should be triggered.
        $clipboard.add('book', book1);
        expect(changeCounter).toBe(2);

        // An item is removed, it's a change in the clipboard, hooks listening for change should be triggered.
        $clipboard.remove('author', author1);
        expect(changeCounter).toBe(3);

        // It was already removed, it's not a change in the clipboard, hooks listening for change should not be
        // triggered.
        $clipboard.remove('author', author1);
        expect(changeCounter).toBe(3);

        // Duplicates are allowed, it's allowed so a change in the clipboard, hooks listening for change should be
        // triggered.
        $clipboard.add('book', book1);
        expect(changeCounter).toBe(4);
        $clipboard.add('book', book1);
        expect(changeCounter).toBe(5);

        // There are some items on the clipboard, so clearing them is a change in the clipboard, hooks listening for
        // change should be triggered.
        $clipboard.clear();
        expect(changeCounter).toBe(6);

        // There are no items on the clipboard, clearing the clipboard is not a change, hooks listening for
        // change should not be triggered.
        $clipboard.clear();
        expect(changeCounter).toBe(6);
    });


    it('Unregistered hooks should not be triggered whenever clipboard changes', () => {
        // this would be increased whenever a change occurs in the clipboard
        let changeCounter = 0;
        const hookFn = function () {
            changeCounter += 1;
        };

        // register a hook for change event on clipboard
        $clipboard.onChange(hookFn);

        // An item is added, it's a change in the clipboard, hooks listening for change should be triggered.
        $clipboard.add('author', author1);
        expect(changeCounter).toBe(1);

        // Another item is added, it's a change in the clipboard, hooks listening for change should be triggered.
        $clipboard.add('book', book1);
        expect(changeCounter).toBe(2);

        // An item is removed, it's a change in the clipboard, hooks listening for change should be triggered.
        $clipboard.remove('author', author1);
        expect(changeCounter).toBe(3);

        // counter value should not be updated after hookFn has stopped listening for changes.
        $clipboard.offChange(hookFn);
        $clipboard.add('book', book2);
        expect(changeCounter).toBe(3);
        $clipboard.remove('book', book2);
        expect(changeCounter).toBe(3);
    });

    it('Should be able to get items by type', () => {
        $clipboard.add('author', author1);
        expect($clipboard.getItemsOfType('author').length).toBe(1);
        expect($clipboard.getItemsOfType('author')).toEqual([['author', author1],]);

        $clipboard.add('author', author2);
        expect($clipboard.getItemsOfType('author').length).toBe(2);

        expect($clipboard.getItemsOfType('book').length).toBe(0);

        expect($clipboard.getItemsOfType('unknownType').length).toBe(0);
    });

    it('Should be able to get items grouped by type', () => {
        $clipboard.add('author', author1);
        $clipboard.add('author', author2);
        $clipboard.add('authors', book2);
        $clipboard.add('authors', book3);
        $clipboard.add('authors', book1);
        $clipboard.add('authors', book5);
        $clipboard.add('authors', book4);

        const itemsGroupedByType = $clipboard.getItemsGroupedByType();

        expect(Object.keys(itemsGroupedByType).length).toBe(2);

        expect(itemsGroupedByType['author'].length).toBe(2);
        expect(itemsGroupedByType['authors'].length).toBe(5);

        // items in a group should be in the same order as they were added
        expect(itemsGroupedByType['author'][0]).toBe(author1);
        expect(itemsGroupedByType['author'][1]).toBe(author2);
        expect(itemsGroupedByType['authors'][0]).toBe(book2);
        expect(itemsGroupedByType['authors'][1]).toBe(book3);
        expect(itemsGroupedByType['authors'][2]).toBe(book1);
        expect(itemsGroupedByType['authors'][3]).toBe(book5);
        expect(itemsGroupedByType['authors'][4]).toBe(book4);
    });
});
