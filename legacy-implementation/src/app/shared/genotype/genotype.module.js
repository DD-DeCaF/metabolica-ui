import angular from 'angular';
import {GenotypeComponent} from './genotype.component';
import GenotypeFactory from './genotype.factory';

export const GenotypeModule = angular
    .module('genotype', [])
    .factory('Genotype', GenotypeFactory)
    .component('genotype', GenotypeComponent);
