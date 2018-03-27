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

import angular from 'angular';
import {SearchToolbarComponent} from './search-toolbar.component';


// TODO make TS interface
// class Search {
//     name = '';
//     pluralName = '';
//     state = '';
//
//     query(resource, searchText) {}
//     stateParams(item) {}
//     formatAsText(item) {}
// }


class SearchSourcesProvider {
    constructor() {
        this.sources = {};
    }

    register(name, source) {
        this.sources[name] = source;
    }

    $get($injector) {
        return Object
            .keys(this.sources)
            .map(resourceName => ({
                source: this.sources[resourceName],
                resource: $injector.get(resourceName)
            }));
    }
}


export const SearchModule = angular.module('search', [])
    .provider('searchSources', SearchSourcesProvider)
    .component('searchToolbar', SearchToolbarComponent);
    //.config((searchSourcesProvider, potionProvider) => {
    //    searchSourcesProvider.register('Project', {
    //        name: 'project',
    //        pluralName: 'projects',
    //        state: 'app.project',
    //
    //        query(Project, searchText) {
    //            return Project.query({where: {code: {$icontains: searchText}}})
    //        },
    //
    //        stateParams(project) {
    //            return {projectId: project.id}
    //        },
    //
    //        formatAsText(project) {
    //            return project.name
    //        }
    //    })
    //});
