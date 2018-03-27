// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
