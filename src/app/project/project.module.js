import angular from 'angular';
import {ProjectComponent} from './project.component';
import {ResourcesModule} from '../shared/resources/resources.module';
import 'angular-ui-router';


export const ProjectModule = angular.module('defaultProject', [
        ResourcesModule.name,
        'ui.router'
    ])
    .component('project', ProjectComponent)
    .config(function ($stateProvider) {
        $stateProvider
            .state({
                name: 'app.project',
                url: '/project/{projectId}',
                component: 'project',
                resolve: {
                    project: ($stateParams, Project) => Project.fetch($stateParams.projectId)
                },
                onEnter($rootScope, project) {
                    $rootScope.project = project;
                },
                onExit($rootScope) {
                    $rootScope.project = null;
                }
            })
    });
