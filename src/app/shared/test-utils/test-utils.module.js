import {TestSelectComponent} from './test-select.component';
import {TestSelectMultipleComponent} from './test-select-multiple.component';

export const TestUtilsModule = angular.module('testUtils', [])
    .component('testSelect', TestSelectComponent)
    .component('testSelectMultiple', TestSelectMultipleComponent);
