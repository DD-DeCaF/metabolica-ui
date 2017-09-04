Using the icon font
-------------------

For any [material design icons](https://material.io/icons/), you can simply use the icon font.
It has been set-up in metabolica-ui/src/utils.scss with:

    @import url('https://fonts.googleapis.com/icon?family=Material+Icons')

In any project based on metabolica-ui, use an icon in a template with:

    <md-icon>menu</md-icon>
    
Find the name of an icon in its [information card](https://material.io/icons/#ic_menu) under `< > ICON FONT`


Using an svg icon
----------------------

SVG icons can be found at [metabolica-ui/img/icons](https://github.com/biosustain/metabolica-ui/tree/master/img/icons)

Extra icons can be downloaded at [material.io/icons](https://material.io/icons).  
You need to edit the SVG file and remove `fill="#000000'` in the first line.
Otherwise the icon will always be black, regardless of theme.


### Icon provider


Register an icon by name in a module with [$mdIconProvider](https://material.angularjs.org/latest/api/service/$mdIconProvider)

    import poolIcon from 'metabolica/img/icons/pool.svg';

    export const PoolsModule = angular.module('pools')
        .config(function ($mdIconProvider) {
            $mdIconProvider.icon('pool', poolIcon);
        }
        
        
### Using icons in templates

Use a registered icon in a template with its name

    <md-icon md-svg-icon="pool"></md-icon>

Or use the path directly

    <md-icon md-svg-icon="../../img/icons/pool.svg">


Setting the icon for a module
----------------------------

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

Icon as a button
----------


    <md-button aria-label="pool"
               class="md-icon-button">
        <md-icon md-svg-icon="pool"></md-icon>
    </md-button>
