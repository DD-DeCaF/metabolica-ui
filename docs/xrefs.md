# XRef module
`xref` module implements two angular components: `<xref>` and `<xref-menu>`. They provide enhancements on top of `ui-sref` directive from `ui-router`.

`xref` module also implements two services:

- `xrefRegistryProvider`, a Provider service
- `xrefMenuPanel`, a Factory service

As a developer, you can add `xref` support for a [potion-node based resource](https://github.com/biosustain/potion-node/blob/master/docs/ANGULARJS.md), e.g. *Pool*, *Strain*, *Experiment* etc. See complete list of registered resources under [resources](https://github.com/biosustain/metabolica-ui/blob/master/src/app/shared/resources/resources.module.js) module.

## xrefRegistryProvider
This *Provider* service allows you to register a `xref` menu config against for a new resource type. `xref` menu config should be a callable function which returns a config to create a new `$mdPanel` for the clicked item. Clicked item points to `value` attribute of `<xref>` or `<xref-menu>` directives.
## xref component
`<xref>` should be used whenever you want `ui-sref` based links. These links behave similar to `href` links, except that links are created on the fly using stateParams.
 
For example:
```html
<xref value="pool"></xref>
```

## xrefMenuPanel
This *Factory* services is used to create a new `$mdPanel` after click event. You need to pass the instance of the clicked Item and click event.

`xrefMenuPanel` is used internally by `<xref-menu>` component. But, it can be used directly as well, e.g. [<project-lineage>](https://github.com/biosustain/metabolica-ui-core/blob/master/src/app/project/project-lineage.component.js). 

## xref-menu component
`<xref-menu>` should be used whenever you want to open a new panel for quick overview of related object. This panel should contain a link to detail page for the current object.

For example:
```html
<xref-menu value="pool"></xref-menu>
```

## Quick example: Adding xref for a new resource
Suppose, you want to add xref for a resource called *Foo*.

#### Step 1 - Adding xref config
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
#### Step 2. Add template for xref panel
```html
<div md-colors="{background: 'default-accent-200'}" layout="column">
  <md-toolbar md-colors="{background: 'default-accent-200'}" class="md-dense md-accent">
    <div class="md-toolbar-tools">
      <h3>{{ $ctrl.foo.name }}</h3>
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

#### Step 3. Register xref config
```js
import * as angular from 'angular';
import {FooComponent} from './foo.component';
import fooXrefMenuConfig from 'xrefs/foo-xref.config';

export const FooModule = angular.module('foo-module', [])
    .component('foo', FooComponent)
    .config(function (xrefRegistryProvider) {
        xrefRegistryProvider.register('Foo', fooXrefMenuConfig);
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

#### Step 4. Use newly created xref in other templates
**xref**
```html
<xref-menu value="foo"></xref-menu>
```
**xref-menu**
```html
<xref value="foo"></xref>
```
