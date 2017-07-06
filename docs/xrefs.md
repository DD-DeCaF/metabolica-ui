# XRefs module
The _XRefs_ module provides AngularJS utilities to better deal with references to [potion-node based resources](https://github.com/biosustain/potion-node/blob/master/docs/ANGULARJS.md) (from now on, _resources_).

Currently it is composed of two services (`xrefRegistry`, `xrefMenuPanel`) and two components (`<xref>`, `<xref-menu>`).

These provide enhancements on top of `ui-sref` directive from _ui-router_.

As a developer, you can implement `<xref>`/`<xref-menu>` support for _resource type_ like **Pool**, **Strain**, **Experiment** and others. See the complete list of registered resources in [_resources_](https://github.com/biosustain/metabolica-ui/blob/master/src/app/shared/resources/resources.module.js) module.

## xrefRegistry
This _Provider_ service allows you to register a `<xref-menu>` configuration for a resource type.

The configuration should be a callable [function which returns an object](https://github.com/biosustain/metabolica-ui-core/blob/master/src/app/pools/xrefs/pool-xref.config.js) with the desired settings.
These settings affect the logic and appearance of the panel shown when clicking on a resource link.

## xrefMenuPanel
This _Factory_ service is used to create a new [`$mdPanel`](https://material.angularjs.org/latest/api/service/$mdPanel) on a _click_ event. You need to pass the instance of the clicked _Item_ and the _click_ event (available through [$event](https://docs.angularjs.org/guide/expression#-event-)).

`xrefMenuPanel` is used internally by `<xref-menu>` component, but it can also be used [directly](https://github.com/biosustain/metabolica-ui-core/blob/master/src/app/project/project-lineage.component.js).

## xref component
`<xref>` should be used instead of `ui-sref` when linking resource instances. These links behave similarly to classic ones, except that references are interpolated on the fly using _$stateParams_ (through a `value` attribute).

## xref-menu component
`<xref-menu>` should be used when you want to show a panel with a quick overview of the clicked resource. This panel should contain a link to the resource's _details_ page. Like `<xref>`, it also uses the `value` attribute.

# How to implement `<xref>` support for a new resource type
Suppose, you want to implement `<xref>`/`<xref-menu>` support for a resource called *Foo*.

#### Step 1. Add a xref config
Create a file called *foo-xref.config.js*:
```js
import template from './foo-xref.menu.html';

class FooMenuController {
}

export default function (foo) {
    return {
        controller: FooMenuController,
        template,
        state: 'app.project.foo',
        stateParams: {
            fooId: foo.id
        },
        locals: {
            foo
        }
    };
}
```

#### Step 2. Add a template for xref-menu
```html
<div md-colors="{background: 'default-accent-200'}" layout="column">
  <md-toolbar md-colors="{background: 'default-accent-200'}" class="md-dense md-accent">
    <div class="md-toolbar-tools">
      <h3>{{ $ctrl.foo.identifier }}</h3>
      <span flex></span>
      <md-button ui-sref="app.project.foo({fooId: $ctrl.foo.id})" class="md-icon-button">
        <md-icon>arrow_forward</md-icon>
        <md-tooltip>Go to foo details page</md-tooltip>
      </md-button>
    </div>
  </md-toolbar>

  <md-content md-colors="{background: 'default-accent-200'}" flex>
    <p>{{ $ctrl.foo.description }}</p>
  </md-content>
</div>
```

#### Step 3. Register the xref config
```js
import angular from 'angular';
import {FooComponent} from './foo.component';
import fooXRefMenuConfig from './xrefs/foo-xref.config';

export const FooModule = angular.module('foo-module', [])
    .component('foo', FooComponent)
    .config(function (xrefRegistryProvider) {
        xrefRegistryProvider.register('Foo', fooXRefMenuConfig);
    })
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
    });
```

#### Step 4. Use the newly xref supported resource type in other templates
```html
<xref value="$ctrl.foo"></xref>
<xref-menu value="$ctrl.foo"></xref-menu>
```
