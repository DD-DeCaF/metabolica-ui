import angular from 'angular';

export const SAMPLE_PROPERTY_NAMES = [
	'strain',
	'medium',
	'feedMedium',
	'experiment',
	'plate',
	'pool',
	'tube'
];

export const SampleSelectionModule = angular
	.module('common.sample-selection', [])
	.constant('SAMPLE_PROPERTY_NAMES', SAMPLE_PROPERTY_NAMES)
	.directive('samplePropertySelect', samplePropertySelectDirective)
	.directive('sampleLabel', sampleLabelDirective);


// <sample-property-select>
function samplePropertySelectDirective() {
	return {
		bindToController: {
			propertyWhitelist: '=enabledProperties'
		},
		controller: SamplePropertySelectDirectiveController,
		controllerAs: 'select',
		replace: true,
		require: [
			'samplePropertySelect',
			'?ngModel'
		],
		restrict: 'EA',
		scope: {},
		template: () => {
			return `<div>
                <md-select
                    ng-model="select.option"
                    aria-label="Sample property">
                    <md-option
                        ng-repeat="property in select.properties"
                        ng-value="property"
                        ng-disabled="select.isPropertyDisabled(property)">
                        {{select.pluralizeProperty(property)}}
                    </md-option>
                </md-select>
            </div>`;
		},
		link(scope, iElement, iAttrs, ctrls) {
			let [select, ngModel] = ctrls;
			if (ngModel) {
				scope.$watch('select.option', (value) => {
					ngModel.$setViewValue(value);
				});

				ngModel.$render = function () {
					let value = ngModel.$viewValue;
					if (value) {
						select.option = value;
					}
				};
			}
		}
	};
}

class SamplePropertySelectDirectiveController {
	constructor() {
		this.properties = SAMPLE_PROPERTY_NAMES;
	}

	isPropertyDisabled(property) {
		if (Array.isArray(this.propertyWhitelist) && this.propertyWhitelist.length) {
			return !this.propertyWhitelist.includes(property);
		}
		return false;
	}

	pluralizeProperty(property) {
		switch(property) {
			case 'medium':
				return 'media';
			case 'feedMedium':
				return 'feed-media';
			default:
				return `${property}s`;
		}
	}
}

/**
 * <sample-label for="">
 */

function sampleLabelDirective(Sample) {
	return {
		replace: true,
		restrict: 'EA',
		scope: {
			sample: '=for'
		},
		template: '<div>{{label}}</div>',
		link(scope) {
			scope.$watch('sample', (sample) => {
				if (sample instanceof Sample) {
					scope.label = sample.labelAsText();
				}
			});
		}
	};
}
