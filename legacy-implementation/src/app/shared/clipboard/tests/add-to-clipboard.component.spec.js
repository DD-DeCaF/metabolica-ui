import {ClipboardProvider} from '../clipboard.module';
import {AddToClipboardController} from '../add-to-clipboard.component';

describe('AddToClipboardComponent', () => {
    let $ctrl, $clipboard;

    const book = {
        name: 'An Introduction to Systems Biology: Design Principles of Biological Circuits',
        author: 'Uri Alon',
    };

    beforeEach(() => {
        let $clipboardProvider = new ClipboardProvider();

        $clipboardProvider.register('book', {
            name: 'Book',
            pluralName: 'Books'
        });

        $clipboard = $clipboardProvider.$get();

        $ctrl = new AddToClipboardController($clipboard);

        // Need to set bindings manually because not using AngularJS context to create controller
        $ctrl.type = 'book';
        $ctrl.value = book;
        // Need to call $onInit() because not using AngularJS context to create the controller
        $ctrl.$onInit();
    });

    it('Should not be added by default', () => {
        expect($ctrl.isAdded).toBe(false);
    });

    it('Should be able to add the item', () => {
        $ctrl.addToClipboard('book', book);

        expect($ctrl.isAdded).toBe(true);
        expect($clipboard.items).toEqual([['book', book]]);
    });

    it('Should not be added anymore if clipboard has been cleared or the item has been removed from the clipboard.', () => {
        $ctrl.addToClipboard('book', book);
        expect($ctrl.isAdded).toBe(true);

        $clipboard.clear();
        expect($ctrl.isAdded).toBe(false);

        $ctrl.addToClipboard('book', book);
        expect($ctrl.isAdded).toBe(true);

        $clipboard.remove('book', book);
        expect($ctrl.isAdded).toBe(false);
    });

    it('Should not be able to add the item if type is not given', () => {
        $ctrl.addToClipboard(null, book);
        expect($ctrl.isAdded).toBe(false);
    });

    it('Should not be able to add the item if value is not given', () => {
        $ctrl.addToClipboard('author', null);
        expect($ctrl.isAdded).toBe(false);
    });

    it('Should not be able to add the item if type is not registered', () => {
        $ctrl.addToClipboard('unknownType', book);

        expect($ctrl.isAdded).toBe(false);
    });
});
