import 'babel-polyfill';
import angular from 'angular';
export {AppModule} from './app/app.module';
import {AppModule} from './app/app.module';
import {ProjectModule} from './app/project/project.module';


export const DevAppModule = angular.module('DevApp', [
    ProjectModule.name,
    AppModule.name
]);

