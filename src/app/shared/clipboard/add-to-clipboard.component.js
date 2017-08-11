class AddToClipboardController {
    constructor($clipboard) {
        this._$clipboard = $clipboard;
        this.isAdded = false;

        this.clipboardChangeHandler = () => {
            this.checkIfAdded(this.type, this.value);
        };
    }

    $onInit() {
        this._$clipboard.onChange(this.clipboardChangeHandler);
    }

    $onChanges() {
        this.checkIfAdded(this.type, this.value);
    }

    $onDestroy() {
        this._$clipboard.offChange(this.clipboardChangeHandler);
    }

    checkIfAdded(type, value) {
        const items = this._$clipboard.getItemsOfType(type);
        this.isAdded = items.length && items.some(([, itemValue]) => itemValue.$uri === value.$uri);
    }

    addToClipboard(type, value) {
        if (!(this.type && this.value)) {
            return;
        }

        if (!this._$clipboard.canAdd(type)) {
            return;
        }

        this._$clipboard.add(type, value);
    }
}

export const AddToClipboardComponent = {
    controller: AddToClipboardController,
    bindings: {
        type: '<',
        value: '<',
    },
    template: `
    <md-button ng-disabled="$ctrl.isAdded" class="md-icon-button" ng-click="$ctrl.addToClipboard($ctrl.type, $ctrl.value)">
      <md-icon ng-hide="$ctrl.isAdded" md-svg-icon="clipboard-plus"></md-icon>
      <md-icon ng-show="$ctrl.isAdded" md-svg-icon="clipboard-check"></md-icon>
    </md-button>`
};
