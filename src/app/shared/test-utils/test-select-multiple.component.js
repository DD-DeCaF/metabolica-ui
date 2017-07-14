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

            if (this.autoSelect) {
                this.selectedTests = this.tests
                    .filter(test => !this.unselectedTests.some(unselectedTest => unselectedTest.id === test.id));
                this.onSelection({selectedTests: this.selectedTests});

                if (!this.defaultTestsUsed && this.tests.length && this.project) {
                    this.project.defaultTests().then(defaultTests => {
                        if (defaultTests.length) {
                            this.selectedTests = defaultTests.reduce((selectedTests, defaultTest) => {
                                const found = this.tests.find(test => test.id === defaultTest.id);
                                return found ? [...selectedTests, found] : selectedTests;
                            }, []);
                            this.onSelection({selectedTests: this.selectedTests});
                        }
                    });
                    this.defaultTestsUsed = true;
                }
            }
        }
    }

    getSelectedText() {
        if (this.selectedTests) {
            return this.selectedTests.length ? `${this.selectedTests.length} tests selected` : `No tests selected`;
        }
    }

    onMenuClose() {
        this.unselectedTests = this.tests
            .filter(test => !this.selectedTests.some(selectedTest => selectedTest.id === test.id));
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
