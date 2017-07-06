import angular from 'angular';
import {LoginComponent} from './login.component';

export const LoginModule = angular.module('login', [])
    .component('login', LoginComponent)
    .config(function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login?next',
            component: 'login',
            data: {
                title: 'Login',
                hideMenus: true
            }
        });
    });
