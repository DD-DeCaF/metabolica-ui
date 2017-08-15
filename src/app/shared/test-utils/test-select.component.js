class TestSelectController {
    constructor($sce) {
        this._$sce = $sce;
        this.defaultTests = [];
        this.lastValidSelection = null;
    }

    $onChanges(changes) {
        if (changes.tests) {
            const groups = new Map();
            for (const test of this.tests) {
                groups.has(test.type) ? groups.get(test.type).push(test) : groups.set(test.type, [test]);
            }

            this.groupedTests = Array.from(groups.entries()).map(([type, tests]) => ({type, tests}));

            // If changing from an empty this.tests to a not-empty one
            if (this.autoSelect && changes.tests.previousValue &&
                !changes.tests.previousValue.length && changes.tests.currentValue.length) {
                if (this.lastValidSelection) {         // Apply last valid selection
                    this.setSelection(this.lastValidSelection);
                    this.lastValidSelection = null;
                } else if (this.defaultTests.length) { // Select a default test
                    this.setSelection(this.defaultTests);
                } else {                               // Otherwise just select a test
                    this.setSelection(this.tests[0]);
                }
            } else { // Otherwise just make sure the current selection is still valid for the current this.tests
                this.setSelection(this.selectedTest);
            }
        }

        if (changes.project) {
            if (changes.project.currentValue) {
                this.project.readDefaultTests().then(defaultTests => {
                    this.defaultTests = defaultTests;
                    const selectableTest = defaultTests
                        .find(defaultTest => this.tests.map(test => test.id).includes(defaultTest.id));
                    if (this.autoSelect && selectableTest) { // if no default test is found, the previous selection won't be lost
                        this.setSelection(selectableTest);
                    }
                });
            } else {
                this.defaultTests = [];
            }
        }
    }

    /**
     * The function will select a test that is actually present in this.tests.
     * If this.selectedTest becomes falsy, the previous value is saved for later use.
     * @function setSelection
     * @param {(Object|Object[])} selection - A single or multiple proposed tests to select.
     */
    setSelection(selection) {
        let selectableTest;
        if (Array.isArray(selection)) {
            selectableTest = selection.find(selectedTest => this.tests.map(t => t.id).includes(selectedTest.id));
        } else {
            selectableTest = this.tests.find(test => test.id === selection.id);
        }

        if (!selectableTest && this.selectedTest) { // New selection is falsy? Save the last selection for later use
            this.lastValidSelection = this.selectedTest;
        }
        this.selectedTest = selectableTest;
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
