class TestSelectMultipleController {
    constructor($sce) {
        this._$sce = $sce;
        this.defaultTests = [];
        this.lastValidSelection = [];
        this.selectedTests = [];
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
                if (this.lastValidSelection.length) {  // Re-apply the last valid selection
                    this.setSelection(this.lastValidSelection);
                    this.lastValidSelection = [];
                } else if (this.defaultTests.length) { // Re-apply the defaultTests selection
                    this.setSelection(this.defaultTests);
                } else {                               // Otherwise just select all tests
                    this.setSelection([...this.tests]);
                }
            } else { // Otherwise just make sure the current selection is still valid for the current this.tests
                this.setSelection(this.selectedTests);
            }
        }

        if (changes.project) {
            if (changes.project.currentValue) {
                this.project.readDefaultTests().then(defaultTests => {
                    this.defaultTests = defaultTests;
                    const selectableTests = defaultTests.filter(defaultTest => this.tests.map(t => t.id).includes(defaultTest.id));
                    if (this.autoSelect && selectableTests.length) { // if no default test is found, the previous selection won't be lost
                        this.setSelection(selectableTests);
                    }
                });
            } else {
                this.defaultTests = [];
            }
        }
    }

    /** @function filterSelectableTests
     * @param {array} tests - A list of tests to filter
     * @returns {array} A list of tests that are actually present in this.tests
     */
    /*filterSelectableTests(tests) {
        return tests.filter(test => this.tests.map(t => t.id).includes(test.id));
    }*/

    getSelectedText() {
        if (this.selectedTests) {
            return this.selectedTests.length ? `${this.selectedTests.length} tests selected` : `No tests selected`;
        }
    }

    /** @function onMenuClose
     * This method is bound to the md-on-close attribute of <md-select>, therefore it gets called every time the user
     * closes the dropdown menu.
     * The method triggers this.onSelection(), which passes the selected tests to the parent component
     */
    onMenuClose() {
        this.setSelection(this.selectedTests);
    }

    /**
     * The function will select only those tests that are actually present in this.tests.
     * If this.selectedTests becomes empty, the previous value is saved for later use.
     * @function setSelection
     * @param {Object[]} selection - The list of proposed tests to select.
     */
    setSelection(selection) {
        const selectableTests = selection.filter(selectedTest => this.tests.map(t => t.id).includes(selectedTest.id));
        if (!selectableTests.length && this.selectedTests.length) { // Passing an empty selection? Save the last selection for later use
            this.lastValidSelection = this.selectedTests;
        }
        this.selectedTests = selectableTests;
        this.onSelection({selectedTests: this.selectedTests});
    }

    testLabelAsHTML(test) {
        return this._$sce.trustAsHtml(`${this.optionsPrefix ? `${this.optionsPrefix} ` : '' }${test.displayName}`);
    }
}

export const TestSelectMultipleComponent = {
    template: `<div>
      <md-select 
        ng-class="{'md-no-underline': !$ctrl.showUnderline}"
        multiple
        placeholder="{{ !$ctrl.tests.length ? 'No test available' : 'No test selected' }}"
        md-on-close="$ctrl.onMenuClose()"
        md-selected-text="$ctrl.getSelectedText()"
        ng-disabled="$ctrl.disabling && !$ctrl.tests.length"
        ng-model="$ctrl.selectedTests">
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
    controller: TestSelectMultipleController,
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
