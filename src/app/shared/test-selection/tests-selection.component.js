class TestsSelectionController {
    constructor($sce) {
        this._$sce = $sce;
    }

    $onChanges() {
        if (this.tests) {
            let groups = new Map();
            for (const test of this.tests) {
                groups.has(test.type) ? groups.get(test.type).push(test) : groups.set(test.type, [test]);
            }

            this.groupedTests = Array.from(groups.entries())
                .map(([type, tests]) => ({
                    type,
                    tests: tests.sort((a, b) => a.displayName.localeCompare(b.displayName))
                }));

            if (this.autoSelect) {
                this.selectedTests = [...this.tests];
                this.onSelection({selectedTests: this.selectedTests});
            }
        }
    }

    testLabelAsHTML(test) {
        return this._$sce.trustAsHtml(`${this.optionsPrefix ? `${this.optionsPrefix} ` : '' }${test.displayName}`);
    }

    getSelectedText() {
        if (this.selectedTests) {
            return this.selectedTests.length ? `${this.selectedTests.length} tests selected` : `No tests selected`;
        }
    }
}

export const TestsSelectionComponent = {
    template: `<div>
      <md-select 
        ng-class="{'md-no-underline': !$ctrl.showUnderline}"
        multiple
        placeholder="{{ !$ctrl.tests.length ? 'No test available' : 'No test selected' }}"
        md-on-close="$ctrl.onSelection({selectedTests: $ctrl.selectedTests})"
        md-selected-text="$ctrl.getSelectedText()"
        ng-disabled="$ctrl.disabling && !$ctrl.tests.length"
        ng-model="$ctrl.selectedTests">
        <md-option ng-if="$ctrl.noValueOption !== ''"
                   ng-value="null">{{ $ctrl.noValueOption }}</md-option>
        <md-optgroup label="{{ group.type }}"
                     ng-repeat="group in $ctrl.groupedTests | orderBy: 'type'">
          <md-option ng-repeat="test in group.tests"
                     ng-value="test">
            <span ng-bind-html="$ctrl.testLabelAsHTML(test)"></span>
          </md-option>
        </md-optgroup>
      </md-select>
    </div>`,
    controller: TestsSelectionController,
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
