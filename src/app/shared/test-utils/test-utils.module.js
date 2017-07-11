import angular from 'angular';
import {TestSelectComponent} from './test-select.component';
import {TestSelectMultipleComponent} from './test-select-multiple.component';
import {TestLabelComponent} from './test-label.component.js';

export const TestUtilsModule = angular.module('testUtils', [])
    .component('testSelect', TestSelectComponent)
    .component('testSelectMultiple', TestSelectMultipleComponent)
    .component('testLabel', TestLabelComponent);
