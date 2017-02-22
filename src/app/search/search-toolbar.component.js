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

        for (let {resource, source} of this.searchSources) {
            let defer = this._$q.defer();
            source.query(resource, searchText)
                .then(results => defer.resolve({
                    results: results,
                    source
                }))
                .catch(() => defer.resolve({source, results: []}));
            searches.push(defer.promise);
        }

        return this._$q.all(searches).then((searches) => {
            return searches
                .map(({source, results}) => results
                    .map(result => ({
                        source,
                        state: source.state,
                        stateParams: source.stateParams(result),
                        text: source.formatAsText(result)
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
