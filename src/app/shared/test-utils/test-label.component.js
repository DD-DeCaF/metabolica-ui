class TestLabelController {
    $onChanges() {
        if (this.test) {
            this.label = this.test.displayName;
            this.tooltip = `${this.test.type} ${this.test.displayName}`;
        } else {
            this.label = '-';
            this.tooltip = '';
        }
    }
}

export const TestLabelComponent = {
    template: `<span> {{ $ctrl.label }}
                   <md-tooltip ng-if="$ctrl.tooltip">{{ $ctrl.tooltip }}</md-tooltip>
               </span>`,
    controller: TestLabelController,
    bindings: {
        test: '=for'
    }
};

