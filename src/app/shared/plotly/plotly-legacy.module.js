import angular from 'angular';
import Plotly from 'plotly.js/lib/core';
import PlotlyBox from 'plotly.js/lib/box';
import PlotlyHeatmap from 'plotly.js/lib/heatmap';
import PlotlyBar from 'plotly.js/lib/bar';
import './plotly/plotly.scss';

// Register plot types
// Scatter plot is already included in the core
Plotly.register([
	PlotlyBox,
	PlotlyHeatmap,
	PlotlyBar
]);

export const PlotlyModule = angular
	.module('plotly', [])
	.service("WindowResize", WindowResize)
	.directive('plot', plotDirective);


function plotDirective(WindowResize) {
	return {
		restrict: 'E',
		scope: {
			plotData: '=',
			plotLayout: '=',
			plotOptions: '='
		},
		link(scope, element, attrs) {
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
						modeBarButtonsToRemove: ['sendDataToCloud']
					}, options || {})
				);
			});

			scope.$on('window-resize', (event) => {
				Plotly.Plots.resize(element[0]);
			});
		}
	}
}

function WindowResize($window, $rootScope) {
	let window = angular.element($window);
	let width = window[0].innerWidth;

	angular.element($window).on('resize', (event) => {
		let newWidth = window[0].innerWidth;
		if (width != newWidth) {
			$rootScope.$broadcast('window-resize', width = newWidth);
		}
	});
}
