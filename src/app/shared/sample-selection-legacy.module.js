import angular from 'angular';

import {Test} from './resources/legacy/types';

export const SAMPLE_PROPERTY_NAMES = [
	'strain',
	'medium',
	'feedMedium',
	'experiment',
	'plate',
	'pool',
	'tube'
];


class TestSelectMultiple {

	constructor($sce, $scope) {
		this._$sce = $sce;
		this._$scope = $scope;
		this.groupedTests = [];
		this.selectedTests = [];
	}

	$onInit() {
		this.ngModel.$render = () => {
			this.selectedTests = this.ngModel.$viewValue;
		};

		this._$scope.$watchCollection(() => this.selectedTests, (value) => {
			this.ngModel.$setViewValue(value);
		});
	}

	testLabelAsHTML(test) {
		return this._$sce.trustAsHtml(test.labelAsHTML(false));
	}

	getSelectedText() {
		if(this.selectedTests.length == 0) {
			return 'No tests'
		} else if (this.selectedTests.length < 7) {
			return this.selectedTests.map(test => test.labelAsText(false)).join(', ')
		} else {
			return `${this.selectedTests.length} tests`
		}
	}

	$onChanges(changes) {
		if(changes.tests) {
			let groups = new Map();

			if(changes.tests.currentValue) {

				for(let test of changes.tests.currentValue) {
					if(groups.has(test.type)) {
						groups.get(test.type).push(test);
					} else {
						groups.set(test.type, [test]);
					}
				}
			}

			this.groupedTests = [];
			for(let [type, tests] of groups.entries()) {
				this.groupedTests.push({type, tests})
			}
		}
	}
}


export const SampleSelectionModule = angular
	.module('common.sample-selection', [])
	.constant('SAMPLE_PROPERTY_NAMES', SAMPLE_PROPERTY_NAMES)
	.directive('testSelect', testSelectDirective)
	.directive('testLabel', testLabelDirective)
	.directive('samplePropertySelect', samplePropertySelectDirective)
	.directive('sampleLabel', sampleLabelDirective)
	.component('testSelectMultiple', {
		template: `
		<md-select ng-model="$ctrl.selectedTests" md-selected-text="$ctrl.getSelectedText()" class="md-no-underline" style="margin: 20px 0 20px 0" multiple>
			<md-optgroup label="{{ group.type }}" ng-repeat="group in $ctrl.groupedTests">
				<md-option ng-repeat="test in group.tests" ng-value="test">
					<span ng-bind-html="$ctrl.testLabelAsHTML(test)"></span>
				</md-option>
			</md-optgroup>
		</md-select>
		`,
		controller: TestSelectMultiple,
		require: {
			ngModel: '^ngModel'
		},
		bindings: {
			tests: '<'
		}
	});

/**
 * <test-select>
 * Use this directive to render all test types.
 */
function testSelectDirective() {
	return {
		bindToController: {
			_tests: '&tests',
			enabledTests: '=',
			isDisabled: '=ngDisabled', // TODO: XXX(lars) should not be necessary. Use ngDisabled directly.
			noValueLabel: '@',
			optionPrefix: '@',
			onOpen: '&mdOnOpen'
		},
		controller: TestSelectDirectiveController,
		controllerAs: 'select',
		replace: true,
		require: [
			'testSelect',
			'?^ngModel'
		],
		restrict: 'EA',
		scope: {},
		template: (tElement, tAttrs) => {
			return `<div>
                <md-select
                    ng-model="select.option"
                    ng-model-options="{trackBy: '$value.key'}"
                    ng-disabled="select.isDisabled"
                    md-on-open="select.onOpen()"
                    aria-label="Test"
                    ${tAttrs.multiple ? 'multiple' : ''}
                    flex>
                    <md-option ng-if="select.noValueLabel" ng-value="undefined">
                        {{select.noValueLabel}}
                    </md-option>
                    <md-divider ng-if="select.noValueLabel && select.tests.length"></md-divider>
                    <md-optgroup ng-if="select.simpleScalars.length" label="Simple Scalars">
                        <md-option
                            ng-repeat="test in select.simpleScalars"
                            ng-value="test"
                            ng-disabled="!select.isTestAvailable(test)">
                            <span ng-bind-html="select.testDisplayName(test)"></span>
                        </md-option>
					</md-optgroup>
					<md-divider ng-if="select.chemicalEntities.length"></md-divider>
					<md-optgroup ng-if="select.chemicalEntities.length" label="Chemical Entities">
                        <md-option
                            ng-repeat="test in select.chemicalEntities"
                            ng-value="test"
                            ng-disabled="!select.isTestAvailable(test)">
                            <span ng-bind-html="select.testDisplayName(test)"></span>
                        </md-option>
					</md-optgroup>
                </md-select>
            </div>`;
		},
		link(scope, iElement, iAttrs, ctrls) {
			let [select, ngModel] = ctrls;

			if (ngModel) {
				scope.$watch('select.option', (value) => {
					ngModel.$setViewValue(value);
				});

				scope.$watch(() => select._tests(), (tests) => {
					if (Array.isArray(tests)) {
						select.tests = tests.map((test) => new Test(test));
					}
				});

				ngModel.$render = function () {
					let value = ngModel.$viewValue;
					if (value) {
						select.option = Array.isArray(value)
							? value.map((item) => item instanceof Test
								? item
								: new Test(item))
							: value instanceof Test
								? value
								: new Test(value);
					}
				};

			}
		}
	};
}

class TestSelectDirectiveController {
	get simpleScalars() {
		return this.testsByType({
			except: ['concentration']
		});
	}

	get chemicalEntities() {
		return this.testsByType({
			only: ['concentration']
		});
	}

	constructor($sce, ChemicalEntity) {
		this._$sce = $sce;
		this._ChemicalEntity = ChemicalEntity;
		this.tests = [];
	}

	testDisplayName(test) {
		return this._$sce.trustAsHtml(`${this.optionPrefix ? `${this.optionPrefix} ` : '' }${test.labelAsHTML()}`);
	}

	testsByType({only = [], except = []}) {
		return this.tests
			.filter((test) => !only.length || (only.length && only.includes(test.type)))
			.filter((test) => !except.includes(test.type));
	}

	isTestAvailable(test) {
		if (Array.isArray(this.enabledTests) && this.enabledTests.length) {
			return this.enabledTests
				.map((test) => test instanceof Test ? test : new Test(test))
				.find((t) => t.key == test.key);
		}

		return true;
	}
}


/**
 * <test-label for="">
 */

function testLabelDirective($sce) {
	return {
		replace: true,
		restrict: 'EA',
		scope: {
			test: '=for'
		},
		template: '<div ng-bind-html="label"></div>',
		link(scope) {
			scope.$watch('test', (test) => {
				if (test instanceof Test) {
					scope.label = $sce.trustAsHtml(test.labelAsHTML());
				}
			});
		}
	};
}


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
