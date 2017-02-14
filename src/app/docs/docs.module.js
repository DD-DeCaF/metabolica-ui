import angular from 'angular';
import {DocsComponent} from './docs.component';
import {DocsResourceComponent} from './docs-resource.component';
import iconPackageVariantClosed from '../../../img/icons/package-variant-closed.svg';


export const DocsModule = angular.module('docs', [])
    .component('docsResource', DocsResourceComponent)
    .component('docs', DocsComponent)
    .config(function ($mdIconProvider, $stateProvider) {
        $mdIconProvider.icon('docs:resource', iconPackageVariantClosed, 24);

        $stateProvider
            .state({
                name: 'app.docs',
                url: '/docs',
                component: 'docs',
                data: {
                    title: 'API Documentation'
                }
            })
            .state('app.docs.resource', {
                url: '/{resourceName:[a-z-_]+}',
                component: 'docsResource',
                data: {
                    title: 'API Resource'
                }
            });
    });
