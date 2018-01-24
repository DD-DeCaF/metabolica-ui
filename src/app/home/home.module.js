import angular from 'angular';

import {HomeComponent} from './home.component';


export const HomeModule = angular.module('Home', [
        'ui.router',
    ])
    .component('home', HomeComponent)
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'app.home',
            url: '/home',
            component: 'home',
            data: {
                title: 'Home',
            }
        });
    });
