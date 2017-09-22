import angular from 'angular';

const sampleAuthor = 'Uri Alon';

const sampleBook = {
    name: 'An Introduction to Systems Biology: Design Principles of Biological Circuits',
    author: sampleAuthor,
};

describe('AddToClipboardComponent', () => {
    let app, $ctrl, element, scope, $rootScope, $clipboard, $compile;

    beforeEach(angular.mock.module('App'));

    beforeEach(() => {
        app = angular.module('App');

        app.config($clipboardProvider => {
            $clipboardProvider.register('author', {
                name: 'Author',
                pluralName: 'Authors'
            });

            $clipboardProvider.register('book', {
                name: 'Book',
                pluralName: 'Books'
            });
        }).run($httpBackend => {
            // blank response
            $httpBackend.whenGET(/^\/_karma_webpack_.*/).respond('');
        });
    });

    beforeEach(angular.mock.inject((_$rootScope_, _$compile_, _$clipboard_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $clipboard = _$clipboard_;

        scope = $rootScope.$new();

        scope.sampleAuthor = sampleAuthor;
        scope.sampleBook = sampleBook;
        scope.$apply();

        element = angular.element('<add-to-clipboard type="book" value="sampleBook"></add-to-clipboard>');
        element = $compile(element)(scope);

        $ctrl = element.controller('addToClipboard');
    }));

    it('Should have found bindings', () => {

        expect($ctrl.value).toBe(sampleBook);
    });

    it('Should not be added by default', () => {
        expect($ctrl.isAdded).toBeFalsy();
    });

    it('Should be able to add the item', () => {
        $ctrl.addToClipboard($ctrl.type, $ctrl.value);

        expect($ctrl.isAdded).toBe(true);
        expect($clipboard.items).toEqual([['book', sampleBook]]);
    });

    it('Should not be able to add the item if type is not given', () => {
        let newElement = angular.element('<add-to-clipboard value="sampleBook" ></add-to-clipboard>');
        newElement = $compile(newElement)(scope);

        let controller = newElement.controller('addToClipboard');

        controller.addToClipboard(controller.type, controller.value);

        expect(controller.isAdded).toBeFalsy();
    });

    it('Should not be able to add the item if value is not given', () => {
        let newElement = angular.element('<add-to-clipboard type="book" ></add-to-clipboard>');
        newElement = $compile(newElement)(scope);

        let controller = newElement.controller('addToClipboard');

        controller.addToClipboard(controller.type, controller.value);

        expect(controller.isAdded).toBeFalsy();
    });

    it('Should not be able to add the item if type is not registered', () => {
        let newElement = angular.element('<add-to-clipboard type="unknownType" value="sampleBook" ></add-to-clipboard>');
        newElement = $compile(newElement)(scope);

        let controller = newElement.controller('addToClipboard');

        controller.addToClipboard(controller.type, controller.value);

        expect(controller.isAdded).toBeFalsy();
    });
});
