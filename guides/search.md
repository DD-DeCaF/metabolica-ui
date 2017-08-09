# Search module
The _Search_ module provides utilities to deal with searching [potion-node based resources](https://github.com/biosustain/potion-node/blob/master/docs/ANGULARJS.md) (from now on, _resources_).

Currently it is composed of one service (`searchSources`) and one component (`<search-toolbar>`).

As a developer, you can implement search for _resource type_ like **Pool**, **Medium**, **Experiment**, **Plate** and others. See the complete list of registered resources in [_resources_](https://github.com/biosustain/metabolica-ui/blob/master/src/app/shared/resources/resources.module.js) module.

## searchSources
This _Provider_ service allows you to register a new source for a resource type which would be availble to `<search-toolbar>`. The configuration should be an object with the desired settings. These settings affect the logic and appearance of search results once you type something in the search toolbar.

## search-toolbar component
`<search-toolbar>` is used in `<app-toolbar>`. You don't need need to use it anywhere else.

# Setting up search for a new resource type
Suppose you want to implement _search_ support for a resource called *Foo*. You need to configure `searchSources` _Provider_ like this:

```js
import angular from 'angular';
import {FooComponent} from './foo.component';

export const FooModule = angular.module('foo-module', [])
    .component('foo', FooComponent)
    .config(function ($stateProvider) {
        $stateProvider.state('app.project.foo', {
            url: '/foo/{fooId:[0-9]+}',
            component: 'foo',
            resolve: {
                foo: ($stateParams, Foo) => Foo.fetch($stateParams.fooId)
            },
            data: {
                switchable: 'app.project.foo',
                title: 'Foo Details'
            }
        });
    })
    .config(function (searchSourcesProvider) {
            searchSourcesProvider.register('Foo', {
                name: 'foo',
                pluralName: 'foos',

                state: 'app.project.foo',

                query(Foo, searchText) {
                    return Foo.query({where: {identifier: {$icontains: searchText}}});
                },

                stateParams(foo) {
                    return {fooId: foo.id};
                },

                formatAsText(foo) {
                    return foo.name;
                }
            });
        });
```
