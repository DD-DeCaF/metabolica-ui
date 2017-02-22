import {SearchToolbarComponent} from './search-toolbar.component';


// TODO make TS interface
class Search {
    name = '';
    pluralName = '';
    state = '';

    query(resource, searchText) {}
    stateParams(item) {}
    formatAsText(item) {}
}


class SearchSourcesProvider {
    constructor() {
        this.sources = {};
    }

    // XXX is component needed?
    register(name, resource) {
        this.sources[name] = resource
    }

    $get($injector) {
        return Object
            .keys(this.sources)
            .map(resourceName => ({
                search: this.sources[resourceName],
                resource: $injector.get(resourceName)
            }));
    }
}


export const SearchModule = angular.module('search', [])
    .provider('searchSources', SearchSourcesProvider)
    .component('searchToolbar', SearchToolbarComponent)
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
