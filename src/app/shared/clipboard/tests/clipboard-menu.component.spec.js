import angular from 'angular';
import {ClipboardMenuPanelController} from '../clipboard-menu.component';

class AuthorListController {
    contructor($sharing) {
        this._$sharing = $sharing;
        this.authors = [];
    }

    $onInit() {
        this.authors = this._$sharing.items('author');
    }
}

const AuthorListComponent = {
    controller: AuthorListController,
    template: `
    <ui>
      <li ng-repeat="author in $ctrl.authors">{{ author.name }}</li>
    </ui>`
};

class BookListController {
    contructor($sharing) {
        this._$sharing = $sharing;
        this.books = [];
    }

    $onInit() {
        this.books = this._$sharing.items('book');
    }
}

const BookListComponent = {
    controller: BookListController,
    template: `
    <ui>
      <li ng-repeat="book in $ctrl.books">{{ book.name }} by  {{ book.author.name }}</li>
    </ui>`
};

class BookDetailController {
    contructor($sharing) {
        this._$sharing = $sharing;
        this.book = [];
    }

    $onInit() {
        this.book = this._$sharing.item('book');
    }
}

const BookDetailComponent = {
    controller: BookDetailController,
    template: `{{ $ctrl.book.name }} by  {{ $ctrl.book.author.name }}`
};


class MixedListController {
    contructor($sharing) {
        this._$sharing = $sharing;
        this.authors = [];
        this.books = [];
    }

    $onInit() {
        this.authors = this._$sharing.items('author');
        this.books = this._$sharing.items('book');
    }
}

const MixedListComponent = {
    controller: MixedListController,
    template: `
    <h3>Authors</h3>
    <ui>
      <li ng-repeat="author in $ctrl.authors">{{ author.name }}</li>
    </ui>
    <h3>Books</h3>
    <ui>
      <li ng-repeat="book in $ctrl.books">{{ book.name }} by  {{ book.author.name }}</li>
    </ui>`
};

angular.module('DevApp')
    .component('authorList', AuthorListComponent)
    .component('bookList', BookListComponent)
    .component('bookDetail', BookDetailComponent)
    .component('mixedList', MixedListComponent)
    .config($stateProvider => {
        $stateProvider
            .state('app.authors', {
                url: '/authors',
                component: 'authorList'
            })
            .state('app.books', {
                url: '/books',
                component: 'bookList'
            })
            .state('app.book', {
                url: '/book',
                component: 'bookDetail'
            })
            .state('app.mixed', {
                url: '/authors-and-books',
                component: 'mixedList'
            });
    })
    .config($sharingProvider => {
        $sharingProvider.register('app.project.authors', {
            accept: [
                {type: 'author', multiple: true}
            ],
            name: 'Authors List'
        });
        $sharingProvider.register('app.project.books', {
            accept: [
                {type: 'book', multiple: true}
            ],
            name: 'Books List'
        });
        $sharingProvider.register('app.project.book', {
            accept: [
                {type: 'book', multiple: false}
            ],
            name: 'Books Detail'
        });
        $sharingProvider.register('app.project.mixed', {
            accept: [
                {type: 'author', multiple: true},
                {type: 'book', multiple: true}
            ],
            name: 'Mixed List'
        });
    });

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

describe('AddToClipboardComponent', () => {
    let $clipboard, $sharing, $ctrl, targetStates;

    beforeEach(angular.mock.module('DevApp'));

    beforeEach(() => {
        angular.module('DevApp')
            .config($clipboardProvider => {
                $clipboardProvider.register('author', {
                    name: 'Author',
                    pluralName: 'Many Authors'
                });

                $clipboardProvider.register('book', {
                    name: 'Book',
                    pluralName: 'So Many Books'
                });
            })
            .run($httpBackend => {
                // blank response
                $httpBackend.whenGET(/^\/_karma_webpack_.*/).respond('');
            });
    });

    beforeEach(angular.mock.inject((_$clipboard_, _$sharing_) => {
        $clipboard = _$clipboard_;
        $sharing = _$sharing_;

        // clear the clipboard before running each test
        $clipboard.clear();
    }));


    it('Panel controller should be empty by default', () => {
        const $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        expect($ctrl.itemGroups).toEqual({});
        expect($ctrl.sharingTargets).toEqual([]);
    });

    it('Should be able to share single item to both targets who accept single and multiple', () => {
        $clipboard.add('author', author1);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        targetStates = new Set($ctrl.sharingTargets.map(({state}) => state));
        expect(targetStates).toEqual(new Set([
            'app.project.authors',
            'app.project.mixed',
        ]));

        $clipboard.clear();
        $clipboard.add('book', book1);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        targetStates = new Set($ctrl.sharingTargets.map(({state}) => state));
        expect(targetStates).toEqual(new Set([
            'app.project.books',
            'app.project.book',
            'app.project.mixed',
        ]));

        $clipboard.clear();
        $clipboard.add('book', book1);
        $clipboard.add('book', book2);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        $ctrl.itemGroups['book'][0].selected = false;
        // We need to call onSelectionChange() manually, because it's only triggered by click, and we're not clicking.
        $ctrl.onSelectionChange();
        targetStates = new Set($ctrl.sharingTargets.map(({state}) => state));
        expect(targetStates).toEqual(new Set([
            'app.project.books',
            'app.project.book',
            'app.project.mixed',
        ]));
    });

    it('Sharing targets which cannot accept multiple objects should be removed when multiple items of that type are selected', () => {
        $clipboard.add('book', book1);
        $clipboard.add('book', book2);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        targetStates = new Set($ctrl.sharingTargets.map(({state}) => state));
        expect(targetStates.has('app.project.book')).toBe(false);
    });

    it('Should be able to share multiple items to sharing targets which accept multiple', () => {
        $clipboard.clear();
        $clipboard.add('author', author1);
        $clipboard.add('author', author2);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        targetStates = new Set($ctrl.sharingTargets.map(({state}) => state));
        expect(targetStates).toEqual(new Set([
            'app.project.authors',
            'app.project.mixed',
        ]));

        $clipboard.clear();
        $clipboard.add('book', book1);
        $clipboard.add('book', book2);
        $clipboard.add('book', book3);
        $clipboard.add('book', book4);
        $clipboard.add('book', book5);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        targetStates = new Set($ctrl.sharingTargets.map(({state}) => state));
        expect(targetStates).toEqual(new Set([
            'app.project.books',
            'app.project.mixed',
        ]));
    });

    it('Should be able to share mix of items to sharing targets which accept them', () => {
        $clipboard.add('author', author1);
        $clipboard.add('author', author2);
        $clipboard.add('book', book1);
        $clipboard.add('book', book2);
        $clipboard.add('book', book3);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        targetStates = new Set($ctrl.sharingTargets.map(({state}) => state));
        expect(targetStates).toEqual(new Set([
            'app.project.authors',
            'app.project.books',
            'app.project.mixed',
        ]));
    });

    it('Should be able to clear all items', () => {
        $clipboard.add('author', author1);
        $clipboard.add('author', author2);
        $clipboard.add('book', book1);
        $clipboard.add('book', book2);
        $clipboard.add('book', book3);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        $ctrl.clear();
        expect($ctrl.itemGroups).toEqual({});
        expect($ctrl.sharingTargets).toEqual([]);
        expect($clipboard.items).toEqual([]);
    });

    it('Should be able to remove items', () => {
        $clipboard.add('author', author1);
        $clipboard.add('author', author2);
        $clipboard.add('book', book1);
        $clipboard.add('book', book2);
        $clipboard.add('book', book3);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);

        $ctrl.remove('author', author1);
        expect($ctrl.itemGroups['author'].length).toBe(1);
        expect($ctrl.itemGroups['author'][0].value.$uri).toEqual(author2.$uri);

        $ctrl.remove('book', book2);
        expect($ctrl.itemGroups['book'].length).toBe(2);
        expect($ctrl.itemGroups['book'][0].value.$uri).toEqual(book1.$uri);
        expect($ctrl.itemGroups['book'][1].value.$uri).toEqual(book3.$uri);

        // Remove everything else
        $ctrl.remove('author', author2);
        $ctrl.remove('book', book1);
        $ctrl.remove('book', book3);
        expect($ctrl.itemGroups).toEqual({author: [], book: []});
        expect($ctrl.sharingTargets).toEqual([]);
        expect($clipboard.items).toEqual([]);
    });

    it('Registered pluralName should be return for known types', () => {
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        expect($ctrl.getTypePluralName('author')).toBe('Many Authors');
        expect($ctrl.getTypePluralName('book')).toBe('So Many Books');
    });

    it('pluralName should be extra `s` for unknown types', () => {
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);
        expect($ctrl.getTypePluralName('mango')).toBe('mangos');
        expect($ctrl.getTypePluralName('unknownType123')).toBe('unknownType123s');
    });

    it('Should be able to get selected item groups', () => {
        $clipboard.add('author', author1);
        $clipboard.add('author', author2);
        $clipboard.add('book', book1);
        $clipboard.add('book', book2);
        $clipboard.add('book', book3);
        $ctrl = new ClipboardMenuPanelController($clipboard, $sharing, null);

        expect($ctrl.getSelectedItemGroups()['author'].length).toBe(2);
        expect($ctrl.getSelectedItemGroups()['book'].length).toBe(3);

        $ctrl.itemGroups['author'][0].selected = false;
        expect($ctrl.getSelectedItemGroups()['author'].length).toBe(1);
        expect($ctrl.getSelectedItemGroups()['book'].length).toBe(3);

        $ctrl.itemGroups['book'][1].selected = false;
        expect($ctrl.getSelectedItemGroups()['author'].length).toBe(1);
        expect($ctrl.getSelectedItemGroups()['book'].length).toBe(2);

        $ctrl.itemGroups['author'][1].selected = false;
        $ctrl.itemGroups['book'][0].selected = false;
        expect($ctrl.getSelectedItemGroups()['author']).toBeUndefined();
        expect($ctrl.getSelectedItemGroups()['book'].length).toBe(1);
        expect($ctrl.getSelectedItemGroups()['book'][0].value.$uri).toBe(book3.$uri);
    });
});
