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
