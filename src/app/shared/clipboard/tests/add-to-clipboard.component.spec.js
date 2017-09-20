import angular from 'angular';
import {AddToClipboardComponent} from '../add-to-clipboard.component';

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

describe('AddToClipboardComponent', () => {
    let app;
    let controller, element, scope;

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

    beforeEach(angular.mock.inject(($rootScope, $compile) => {
        scope = $rootScope.$new();

        scope.sampleAuthor = author1;
        scope.sampleBook = book1;
        scope.$apply();

        element = angular.element('<add-to-clipboard type="book" value="sampleBook"></add-to-clipboard>');
        element = $compile(element)(scope);

        controller = element.controller('addToClipboard');
    }));

    it('should have value found', () => {
        expect(controller.value).toBe(book1);
    });
});
