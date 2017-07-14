class TestSelectController {
    constructor($sce) {
        this._$sce = $sce;
        this.defaultTestsUsed = false;
    }

    $onChanges(changes) {
        if (changes.tests) {
            const groups = new Map();
            for (const test of this.tests) {
                groups.has(test.type) ? groups.get(test.type).push(test) : groups.set(test.type, [test]);
            }

            this.groupedTests = Array.from(groups.entries()).map(([type, tests]) => ({type, tests}));

            if (this.autoSelect) {
                if (!this.selectedTest || !this.tests.some(test => test.id === this.selectedTest.id)) {
                    this.selectedTest = this.tests && this.tests.length ? this.tests[0] : null;
                    this.onSelection({selectedTest: this.selectedTest});
                }

                if (!this.defaultTestsUsed && this.tests.length && this.project) {
                    this.project.defaultTests().then(defaultTests => {
                        if (defaultTests.length) {
                            this.selectedTest = defaultTests[0];
                            this.onSelection({selectedTest: this.selectedTest});
                        }
                    });
                    this.defaultTestsUsed = true;
                }
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
                     ng-repeat="group in $ctrl.groupedTests | orderBy: 'type'">
          <md-option ng-repeat="test in group.tests | orderBy: 'displayName'"
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
        project: '<',
        showUnderline: '<',
        tests: '<'
    }
};
