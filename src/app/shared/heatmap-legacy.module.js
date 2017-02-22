import chroma from 'chroma-js';
import angular from 'angular';

// FIXME hacked together and re-renders every time a new item is added (should aggregate multiple changes).

function HeatmapDirective() {
	return {
		restrict: 'E',
		scope: {
			// TODO colors
			// TODO filter function (can also be on item)
			disabled: '=',
			transparent: '='
		},
		controller($scope, $timeout) {
			const colors = ['#008ae5', 'yellow'];
			const items = [];

			this.add = (item) => {
				items.push(item);
			};

			this.remove = (item) => {
				items.splice(items.indexOf(item), 1);
				this.scheduleRender();
			};

			$scope.$watch('disabled', () => {
				this.scheduleRender();
			});

			$scope.$watch('transparent', () => {
				this.scheduleRender();
			});

			this.render = (disabled, transparent, items) => {
				let max = -Infinity, min = Infinity;

				if (disabled) {
					for (let item of items) {
						item.update(null, null);
					}
					return;
				}

				for (let item of items) {
					let value = item.value;

					if (value != null) {
						if (value > max) {
							max = value
						}
						if (value < min) {
							min = value
						}
					}
				}

				if (min == Infinity) {
					for (let item of items) {
						item.update(null, null);
					}
				} else if (min == max) {
					let scale = chroma.scale(colors);
					let backgroundColor = scale(0.5);
					let color = scale(1.0);

					for (let item of items) {
						let value = item.value;

						if (value === null) {
							item.update('#f3f3f3', '#e0e0e0');
						} else if (value === undefined) {
							item.update(null, null, true);
						} else {
							item.update(backgroundColor.alpha(transparent ? 0.5 : 1).css(), color.hex());
						}
					}
				} else {
					let center = (min + max) / 2;
					let scale = chroma
						.scale(colors)
						.domain([min, max]);

					for (let item of items) {
						let value = item.value;

						if (value === null) {
							item.update('#f3f3f3', '#e0e0e0');
						} else if (value === undefined) {
							item.update(null, null, true);
						} else {
							let backgroundColor = scale(value);
							let color = value > center ? scale(min) : scale(max);
							item.update(backgroundColor.alpha(transparent ? 0.5 : 1).css(), color.hex());
						}
					}
				}
			}

			// HACK for deferred rendering. Should read the docs and do this properly
			this.timeout = null;
			this.scheduleRender = () => {
				if (this.timeout) {
					$timeout.cancel(this.timeout);
				}
				this.timeout = $timeout(() => {
					//$scope.$applyAsync(()
					this.timeout = null;

					let groups = new Set(items.map((item) => item.group));

					if (groups.size == 1) {
						this.render($scope.disabled, $scope.transparent, items);
					} else {
						for (let group of groups) {
							this.render(
								$scope.disabled,
								$scope.transparent,
								items.filter((item) => item.group == group)
							);
						}
					}
				}, 100)
			}
		}
	}
}

function HeatmapItemDirective() {
	return {
		require: '^heatmap',
		restrict: 'A',
		scope: {
			values: '=',
			heatmapItem: '&'
		},
		link(scope, element, attrs, heatmapController) {

			let item = {value: undefined};
			item.update = (backgroundColor, color) => {
				element.css({color, 'background-color': backgroundColor});
			};

			scope.$watch('heatmapItem', (group) => {
				item.group = group();
			});

			scope.$watch('values', (values) => {
				if (values === undefined || values === null) {
					item.value = null;
				} else if (values instanceof Array) {
					if(values.length == 0) {
						item.value = null;
					} else {
						item.value = values.reduce((a, b) => a + b) / values.length;
					}
				} else {
					item.value = values;
				}

				heatmapController.scheduleRender();
			});

			heatmapController.add(item);

			scope.$on('$destroy', () => {
				heatmapController.remove(item);
			});
		}
	}
}


export const HeatmapModule = angular.module('heatmap', [])
	.directive('heatmap', HeatmapDirective)
	.directive('heatmapItem', HeatmapItemDirective);
