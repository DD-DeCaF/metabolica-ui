import 'babel-polyfill';
import angular from 'angular';
export {AppModule} from './app/app.module';
import {AppModule} from './app/app.module';
import {ProjectModule} from './app/project/project.module';
import {PlotlyModule} from './app/shared/plotly/plotly-legacy.module';
export {PlotlyModule} from './app/shared/plotly/plotly-legacy.module';
import {GenotypeModule} from './app/shared/genotype/genotype.module';
export {GenotypeModule} from './app/shared/genotype/genotype.module';
import {MaintenanceModule} from './app/shared/maintenance/maintenance.module';
import './utils.scss';


export const DevAppModule = angular.module('DevApp', [
    ProjectModule.name,
    AppModule.name,
    MaintenanceModule.name,
	PlotlyModule.name,
    GenotypeModule.name
]).config(function (appNameProvider) {
    appNameProvider.name = 'Metabolica (Dev)';
});
