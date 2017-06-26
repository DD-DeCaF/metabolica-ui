import {TestSelectionComponent} from './test-selection.component';
import {TestsSelectionComponent} from './tests-selection.component';
import {TestSelectionToolbarComponent} from './test-selection-toolbar.component';
import {TestPlotComponent} from './test-plot.component';

export const TestSelectionModule = angular.module('testSelection', [])
    .component('testSelection', TestSelectionComponent)
    .component('testsSelection', TestsSelectionComponent)
    .component('testSelectionToolbar', TestSelectionToolbarComponent)
    .component('testPlot', TestPlotComponent);
