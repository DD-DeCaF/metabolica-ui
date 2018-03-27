// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
                    results,
                    source
                }))
                .catch(() => defer.resolve({source, results: []}));
            searches.push(defer.promise);
        }

        return this._$q.all(searches)
            .then(searches =>
                searches.map(({source, results}) => results
                    .map(result => ({
                        source,
                        state: source.state,
                        stateParams: source.stateParams(result),
                        text: source.formatAsText(result)
                    })))
                    .reduce((a, b) => a.concat(b), [])
                    .sort((a, b) => a.text.localeCompare(b.text))
        );
    }

    selectedItemChange(item) {
        if (item) {
            this.searchText = null;
            this.selectedItem = null;
            this._$state.go(item.state, item.stateParams);

            // NOTE workaround for https://github.com/angular/material/issues/5407
            this._$mdUtil.enableScrolling();
            this.showSearch = false;
        }
    }
}


export const SearchToolbarComponent = {
    controller: SearchToolbarController,
    transclude: true,
    template
};
