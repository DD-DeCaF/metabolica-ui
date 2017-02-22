import template from './search-toolbar.component.html';
import './search-toolbar.component.scss';


class SearchToolbarController {
    showSearch = false;
    searchText = '';
    selectedItem = null;

    constructor(searchSources, $mdUtil, $state, $q) {
        this.searchSources = searchSources;
        this._$mdUtil = $mdUtil;
        this._$state = $state;
        this._$q = $q;

        // TODO generate placeholder from search resources:
        // "Search plates, media, pools, isolates and more."
    }

    toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    query(searchText) {
        let searches = [];

        for (let {resource, search} of this.searchSources) {
            let defer = this._$q.defer();
            search.query(resource, searchText)
                .then(results => defer.resolve({
                    results: results,
                    search
                }))
                .catch(() => defer.resolve({search, results: []}));
            searches.push(defer.promise);
        }

        return this._$q.all(searches).then((searches) => {
            return searches
                .map(({search, results}) => results
                    .map(result => ({
                        search,
                        state: search.state,
                        stateParams: search.stateParams(result),
                        text: search.formatAsText(result)
                    })))
                .reduce((a, b) => a.concat(b), [])
                .sort((a, b) => a.text.localeCompare(b.text));
        });
    }

    selectedItemChange(item) {
        if (item) {
            this.searchText = null;
            this.selectedItem = null;
            this._$state.go(item.state, item.stateParams);

            // NOTE workaround for https://github.com/angular/material/issues/5407
            this._$mdUtil.enableScrolling()
        }
    }
}


export const SearchToolbarComponent = {
    controller: SearchToolbarController,
    transclude: true,
    template
};
