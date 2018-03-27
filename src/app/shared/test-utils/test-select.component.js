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

class TestSelectController {
    constructor($sce) {
        this._$sce = $sce;
    }

    $onChanges() {
        this.selectedTest = null;
        this.groupedTests = [];

        if (this.tests && this.tests.length) {
            const groups = new Map();
            for (const test of this.tests) {
                groups.has(test.type) ? groups.get(test.type).push(test) :
                    groups.set(test.type, [test]);
            }

            this.groupedTests = Array.from(groups.entries())
                .map(([type, tests]) => ({
                    type,
                    tests: tests.sort((a, b) => a.displayName.localeCompare(b.displayName))
                }))
                .sort((a, b) => a.type.localeCompare(b.type));

            if (this.autoSelect) {
                let found;
                if (typeof this.autoSelect !== 'boolean') {
                    for (const group of this.groupedTests) {
                        found = group.tests.find(test => test.id === this.autoSelect.id);
                        if (found) {
                            this.selectedTest = found;
                            break;
                        }
                    }
                }
                if (typeof this.autoSelect === 'boolean' || !found) {
                    this.selectedTest = this.groupedTests[0].tests[0];
                }
                this.onSelection({selectedTest: this.selectedTest});
            }
        }
    }

    testLabelAsHTML(test) {
        return this._$sce.trustAsHtml(`${this.optionsPrefix ? `${this.optionsPrefix} ` : '' }${test.displayName}`);
    }
}

export const TestSelectComponent = {
    template: `<div>
      <md-select
        ng-class="{'md-no-underline': !$ctrl.showUnderline}"
        placeholder="{{ !$ctrl.tests.length ? 'No test available' : 'No test selected' }}"
        md-on-close="$ctrl.onSelection({selectedTest: $ctrl.selectedTest})"
        ng-disabled="$ctrl.disabling && !$ctrl.tests.length"
        ng-model="$ctrl.selectedTest">
        <md-option ng-if="$ctrl.noValueOption !== ''"
                   ng-value="null">{{ $ctrl.noValueOption }}</md-option>
        <md-optgroup label="{{ group.type }}"
                     ng-repeat="group in $ctrl.groupedTests">
          <md-option ng-repeat="test in group.tests"
                     ng-value="test">
            <span ng-bind-html="$ctrl.testLabelAsHTML(test)"></span>
          </md-option>
        </md-optgroup>
      </md-select>
    </div>`,
    controller: TestSelectController,
    bindings: {
        autoSelect: '<',
        disabling: '<',
        noValueOption: '@',
        onSelection: '&',
        optionsPrefix: '@',
        showUnderline: '<',
        tests: '<'
    }
};
