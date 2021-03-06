import 'angular-material';
import 'angular-material/angular-material.min.css';
import MdDataTable from 'angular-material-data-table';
import 'angular-material-data-table/dist/md-data-table.css';
import 'angular-ui-router';
import 'angular-messages';
import angular from 'angular';
import {AppComponent} from './app.component';
import {AppToolbarComponent} from './app-toolbar.component';
import {SessionModule} from './shared/session/session.module';
import {SharingModule} from './shared/sharing/sharing-legacy.module';
import {DocsModule} from './docs/docs.module';
import {SearchModule} from './search/search.module';

import {DirectivesModule} from './shared/directives-legacy.module';
import {XRefsModule} from './shared/xrefs/xrefs.module';
import {TestUtilsModule} from './shared/test-utils/test-utils.module';
import {ClipboardModule} from './shared/clipboard/clipboard.module';

import iconPuzzle from '../../img/icons/puzzle.svg';
import iconShare from '../../img/icons/share.svg';


class AppNavigationProvider {
    constructor() {
        // Two lists of components: for authorised and unauthorised users
        this.navigation = [];
    }

    // XXX is component needed?
    register(state, {title, position = null, authRequired = true, icon = 'puzzle', order = Number.MAX_VALUE,
        stateParams = {}} = {}) {
		if (!position) {
			if (state.startsWith('app.project.')) {
				position = 'project';
			} else {
				position = 'global';
			}
		}

        let module = {state: `${state}(${JSON.stringify(stateParams)})`, title, position, icon, order, authRequired};
        this.navigation.push(module);
    }

    $get() {
        return this.navigation;
    }


}


class AppNameProvider {
    name = 'Metabolica';

    $get() {
        return this.name;
    }
}


class AppAuthProvider {
    isRequired = true;
    trustedURLs = new Set();

    $get($location) {
        return {
            isRequired: this.isRequired,
            trustedURLs: this.trustedURLs,
            isTrustedURL: url => {
                const currentURL = new URL(url, $location.absUrl());
                return currentURL.hostname === $location.host() || Array.from(this.trustedURLs).some(trustedURL => currentURL.href.startsWith(trustedURL));
            },
        };
    }
}


export const AppModule = angular.module('App', [
        'ngAnimate',
        'ngAria',
        'ngMaterial',
        'ngMessages',
        'ui.router',
        MdDataTable,
        SessionModule.name,
        SharingModule.name,
        DocsModule.name,
        XRefsModule.name,
        SearchModule.name,
        DirectivesModule.name,
        TestUtilsModule.name,
        ClipboardModule.name,
    ])
    .provider('appNavigation', AppNavigationProvider)
    .provider('appName', AppNameProvider)
    .provider('appAuth', AppAuthProvider)
    .component('app', AppComponent)
    .component('appToolbar', AppToolbarComponent)
    .config(function ($mdThemingProvider) {
        /**
         * Theming
         */

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey', {
                'default': '400'
            })
            .backgroundPalette('grey', {
                'default': 'A100'
            });
    })
    .config(function ($httpProvider, potionProvider) {
        /**
         * Specify the API root and ensure requests are get annotated with the session token.
         */
        potionProvider.config({prefix: '/api'});
        $httpProvider.interceptors.push('sessionInterceptor');
    })
    .config(function ($mdIconProvider) {
        $mdIconProvider.icon('puzzle', iconPuzzle, 24);
        $mdIconProvider.icon('share', iconShare, 24);
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        /**
         * Set up states and specify default state
         */

        $stateProvider.state({
            name: 'app',
            url: '/app',
            component: 'app'
        });

        $urlRouterProvider.otherwise('/app/home');
        $locationProvider.html5Mode(true);
    })
    .run(function ($transitions, $state, $location, $log, $mdDialog, $window, appName) {
        // https://github.com/angular/material/issues/3418
        $transitions.onStart({}, () => {
            $mdDialog.cancel();
        });

        $transitions.onStart({}, transition => {
            transition.promise.finally(() => {
                let title = $state.current.data && $state.current.data.title;
                $window.document.title = title ? `${appName} – ${title}` : appName;
            });
        });
    });
