class TestSelectMultipleController {
    constructor($sce) {
        this._$sce = $sce;
        this.selectedTests = [];
        this.unselectedTests = [];
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
            // Projects without default tests would have all tests selected at first load. this.autoSelect avoids it.
            if (this.autoSelect) {
                this.setSelection(this.tests
                    .filter(test => !this.unselectedTests.some(unselectedTest => unselectedTest.id === test.id)));

                if (!this.defaultTestsUsed && this.tests.length && this.project) {
                    this.project.readDefaultTests().then(defaultTests => {
                        const selectedTests = defaultTests
                            .filter(defaultTest => this.tests.some(test => test.id === defaultTest.id));
                        if (selectedTests.length) { // if no default test is found, the previous selection won't be lost
                            this.setSelection(selectedTests);
                        }
                    });
                    this.defaultTestsUsed = true;
                }
            } else {
                this.setSelection(this.selectedTests.filter(test => this.tests.includes(test)));
            }
        }
    }

    getSelectedText() {
        if (this.selectedTests) {
            return this.selectedTests.length ? `${this.selectedTests.length} tests selected` : `No tests selected`;
        }
    }

    /** @function onMenuClose
     * This method is bound to the md-on-close attribute of <md-select>, therefore it gets called every time the user
     * closes the dropdown menu.
     * It updates this.unselectedTests with a list of tests (from this.tests) that are not selected
     * The method also triggers this.onSelection(), which passes the selected tests to the parent component
     */
    onMenuClose() {
        this.unselectedTests = this.tests
            .filter(test => !this.selectedTests.some(selectedTest => selectedTest.id === test.id));
        this.onSelection({selectedTests: this.selectedTests});
    }

    setSelection(selectedTests) {
        this.selectedTests = selectedTests;
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
