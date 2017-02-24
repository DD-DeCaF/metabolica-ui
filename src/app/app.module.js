import 'angular-material';
import 'angular-material/angular-material.min.css';
import MdDataTable from 'angular-material-data-table';
import 'angular-material-data-table/dist/md-data-table.css';
import 'angular-ui-router';
import 'angular-messages';
import angular from 'angular';
import {AppComponent} from './app.component';
import {AppHomeComponent} from './app-home.component';
import {AppToolbarComponent} from './app-toolbar.component';
import {SessionModule} from './shared/session/session.module';
import {SharingModule} from './shared/sharing/sharing-legacy.module';
import {LoginModule} from './login/login.module';
import {DocsModule} from './docs/docs.module';
import {SearchModule} from './search/search.module';

import {DirectivesModule} from './shared/directives-legacy.module';
import {XRefsModule} from './shared/xrefs/xrefs.module';

import iconPuzzle from '../../img/icons/puzzle.svg';


class AppNavigationProvider {
    constructor() {
        this.navigation = [];
    }

    // XXX is component needed?
    register(state, {title, position=null, icon='puzzle'} = {}) {
		if(!position) {
			if(state.startsWith('app.project')) {
				position = 'project';
			} else {
				position = 'global';
			}
		}

        this.navigation.push({state, title, position, icon});
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


export const AppModule = angular.module('App', [
        'ngAnimate',
        'ngAria',
        'ngMaterial',
        'ngMessages',
        'ui.router',
        MdDataTable,
        SessionModule.name,
        SharingModule.name,
        LoginModule.name,
        DocsModule.name,
        XRefsModule.name,
        SearchModule.name,
        DirectivesModule.name
    ])
    .provider('appNavigation', AppNavigationProvider)
    .provider('appName', AppNameProvider)
    .component('app', AppComponent)
    .component('appHome', AppHomeComponent)
    .component('appToolbar', AppToolbarComponent)
    .config(function ($mdThemingProvider) {
        /**
         * Theming
         */

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey', {
                default: '400'
            })
            .backgroundPalette('grey', {
                default: 'A100'
            });
    })
    .config(function ($httpProvider, potionProvider) {
        /**
         * Specify the API root and ensure requests are get annotated with the session token.
         */
        potionProvider.config({prefix: '/api'});
        //$httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.interceptors.push('sessionInterceptor');
    })
    .config(function ($mdIconProvider) {
        $mdIconProvider.icon('puzzle', iconPuzzle, 24);
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        /**
         * Set up states and specify default state
         */

        $stateProvider
            .state({
                name: 'app',
                url: '/app',
                component: 'app'
            })
            .state({
                name: 'app.home',
                url: '/home',
                component: 'appHome',
                data: {
                    title: 'Home'
                }
            });

        $urlRouterProvider.otherwise('/app/home');
        $locationProvider.html5Mode(true);
    })
    .run(function ($rootScope, $state, $location, $log, $mdDialog) {
        // https://github.com/angular/material/issues/3418
        $rootScope.$on('$stateChangeStart', () => {
            $log.log('state change start', $state)
            $mdDialog.cancel();
        });
    });



