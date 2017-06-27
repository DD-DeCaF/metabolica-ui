import template from './test-selection-toolbar.component.html';
import {RESOURCE_ID_KEY} from './test-plot.component';

class TestSelectionToolbarController {
    constructor() {
        this.boxType = null;
        this.boxTypeOptions = [];
        this.groupBy = null;
        this.resourcePlural = {
            experiment: 'experiments',
            medium: 'media',
            plate: 'plates',
            strain: 'strains'
        };
        this.selectedTest = null;
        this.tests = [];
    }

    $onChanges() {
        if (this.measurements && this.measurements.length) {
            this.boxTypeOptions = Object.keys(RESOURCE_ID_KEY)
                                        .filter(resource => Object.entries(this.measurements[0])
                                                                  .filter(([, value]) => value)
                                                                  .map(([key,]) => key)
                                                                  .join()
                                                                  .toLowerCase()
                                                                  .includes(resource));
            this.boxType = this.boxTypeOptions.includes('strain') ? 'strain' : this.boxTypeOptions[0];
            this.tests = Array.from(new Set(this.measurements.map(measurement => measurement.test)));
        }
    }

    onTestSelection(selectedTest) {
        this.selectedTest = selectedTest;
        this.selectionChange();
    }

    selectionChange() {
        this.updateSelections({
            groupBy: this.groupBy,
            resourceToCompare: this.boxType,
            selectedTest: this.selectedTest,
        });
    }
}

export const TestSelectionToolbarComponent = {
    bindings: {
        measurements: '<',
        updateSelections: '&'
    },
    controller: TestSelectionToolbarController,
    template
};
