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

            // Some pages don't desire an auto-selection behaviour, therefore the need of this.autoSelect
            // Projects without any default test would have a test selected at first load. this.autoSelect avoids it.
            if (this.autoSelect) {
                if (this.tests.length) {
                    if (this.selectedTest) {
                        this.setSelection(this.tests.find(test => test.id === this.selectedTest.id));
                    }
                    if (!this.selectedTest) {
                        this.setSelection(this.tests[0]);
                    }
                } else {
                    this.setSelection(null);
                }

                if (!this.defaultTestsUsed && this.tests.length && this.project) {
                    this.project.readDefaultTests().then(defaultTests => {
                        const selectedTest = defaultTests
                            .find(defaultTest => this.tests.map(test => test.id).includes(defaultTest.id));
                        if (selectedTest) { // if no default test is found, the previous selection won't be lost
                            this.setSelection(selectedTest);
                        }
                    });
                    this.defaultTestsUsed = true;
                }
            } else if (this.selectedTest) {
                this.setSelection(this.tests.find(test => test.id === this.selectedTest.id));
            }
        }
    }

    setSelection(selectedTest) {
        this.selectedTest = selectedTest;
        this.onSelection({selectedTest: this.selectedTest});
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
