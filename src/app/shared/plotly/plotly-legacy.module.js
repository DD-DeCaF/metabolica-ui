import angular from 'angular';
import Plotly from 'plotly.js/lib/core';
import PlotlyBox from 'plotly.js/lib/box';
import PlotlyHeatmap from 'plotly.js/lib/heatmap';
import PlotlyBar from 'plotly.js/lib/bar';
import './plotly.scss';

// Register plot types
// Scatter plot is already included in the core
Plotly.register([
    PlotlyBox,
    PlotlyHeatmap,
    PlotlyBar
]);

export const PlotlyModule = angular
    .module('plotly', [])
    .service('WindowResize', WindowResize)
    .directive('plot', plotDirective);


function plotDirective() {
    return {
        restrict: 'E',
        scope: {
            plotData: '=',
            plotLayout: '=',
            plotOptions: '='
        },
        link(scope, element) {
            scope.$watchGroup(['plotData', 'plotLayout', 'plotOptions'], ([data, layout, options]) => {
                data = data || [];
                Plotly.newPlot(
                    element[0],
                    data,
                    layout,
                    Object.assign({
                        displaylogo: false,
                        showLink: false,
                        showTips: false,
                        sendData: false,
                        modeBarButtonsToRemove: ['sendDataToCloud'],
                        modeBarButtonsToAdd: [{
                            // https://github.com/plotly/plotly.js/issues/1576
                            name: 'toLargeImage',
                            title: 'Download plot as a png (larger image)',
                            icon: Plotly.Icons['camera-retro'],
                            click(gd) {
                                Plotly.downloadImage(gd, {
                                    format: 'png',
                                    width: 1200,
                                    filename: 'newplot'}
                                );
                            }
                        }]
                    }, options || {})
                );
            });

            function onResize() {
                Plotly.Plots.resize(element[0]);
            }

            scope.$on('window-resize', () => {
                onResize();
            });

            scope.$watch(function () {
                return {
                    h: element[0].offsetHeight,
                    w: element[0].offsetWidth
                };
            }, function (newValue, oldValue) {
                if (angular.equals(newValue, oldValue)) {
                    return;
                }
                onResize();
            }, true);
        }
    };
}

function WindowResize($window, $rootScope) {
    let window = angular.element($window);
    let width = window[0].innerWidth;

    angular.element($window).on('resize', () => {
        let newWidth = window[0].innerWidth;
        if (width != newWidth) {
            $rootScope.$broadcast('window-resize', width = newWidth);
        }
    });
}
