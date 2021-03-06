import 'babel-polyfill';
import angular from 'angular';
export {AppModule} from './app/app.module';
import {AppModule} from './app/app.module';
import {HomeModule} from './app/home/home.module';
export {HomeModule} from './app/home/home.module';
import {ProjectModule} from './app/project/project.module';
import {PlotlyModule} from './app/shared/plotly/plotly-legacy.module';
export {PlotlyModule} from './app/shared/plotly/plotly-legacy.module';
import {GenotypeModule} from './app/shared/genotype/genotype.module';
export {GenotypeModule} from './app/shared/genotype/genotype.module';
import {LoginModule} from './app/login/login.module';
export {LoginModule} from './app/login/login.module';
import {MaintenanceModule} from './app/shared/maintenance/maintenance.module';
import './utils.scss';


export const DevAppModule = angular.module('DevApp', [
    LoginModule.name,
    ProjectModule.name,
    AppModule.name,
    HomeModule.name,
    MaintenanceModule.name,
	PlotlyModule.name,
    GenotypeModule.name,
]).config(function (appNameProvider) {
    appNameProvider.name = 'Metabolica (Dev)';
});
