Icons
-----

SVG icons can be found at [metabolica-ui/img/icons](https://github.com/biosustain/metabolica-ui/tree/master/img/icons)

Extra icons can be downloaded at https://material.io/icons/

Icon provider
------------

Register an icon by name in a module with [$mdIconProvider](https://material.angularjs.org/latest/api/service/$mdIconProvider)

    import poolIcon from 'metabolica/img/icons/pools.svg';

    export const PoolsModule = angular.module('pools')
        .config(function ($mdIconProvider) {
            $mdIconProvider.icon('pool', poolIcon);
        }

Use it in a template with the [md-icon](https://material.angularjs.org/latest/api/directive/mdIcon) directive

    <md-icon md-svg-icon="pool"></md-icon>


-------

Set the icon for a module by specifying `icon` in `appNavigationProvider.register`. It will appear on the left menu.

```
import angular from 'angular';
import settingsIcon from '../../img/icons/settings.svg';


export const ProjectSettingsModule = angular.module('ProjectSettings', ['ngMessages'])
    .config(function ($mdIconProvider, appNavigationProvider) {
        $mdIconProvider.icon('settings', settingsIcon, 24);

        appNavigationProvider
            .register('app.project.settings', {
                title: 'Project Settings',
                icon: 'settings',
            });
    });
```
