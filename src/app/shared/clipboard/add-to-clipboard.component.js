class AddToClipboardController {
    constructor($mdToast, $clipboard) {
        this._$mdToast = $mdToast;
        this._$clipboard = $clipboard;

        this.clipboardChangeHandler = () => this.added = this.checkIfAdded(this.type, this.value);
    }

    $onInit() {
        this._$clipboard.onChange(this.clipboardChangeHandler);
    }

    $onChanges(changes) {
        this.added = this.checkIfAdded(this.type, this.value);
    }

    $onDestroy() {
        this._$clipboard.offChange(this.clipboardChangeHandler);
    }

    checkIfAdded(type, item) {
        return this._$clipboard.getItems(type).some(_item => _item.$uri === item.$uri);
    }

    addToClipboard(type, value) {
        if (!(this.type && this.value)) {
            return;
        }

        if (!this._$clipboard.canAdd(type)) {
            return;
        }

        this._$clipboard.add(type, value);

        const toastMessage = `"${this._$clipboard.getAsText(type, value)}" has been added to the clipboard.`;
        this._$mdToast.show(this._$mdToast.simple()
            .textContent(toastMessage)
            .hideDelay(2000));
    }
}

export const AddToClipboardComponent = {
    controller: AddToClipboardController,
    bindings: {
        type: '<',
        value: '<',
    },
    template: `
    <md-button ng-hide="$ctrl.added" class="md-icon-button" ng-click="$ctrl.addToClipboard($ctrl.type, $ctrl.value)">
      <md-icon md-svg-icon="clipboard-plus"></md-icon>
    </md-button>
    <md-button ng-show="$ctrl.added" class="md-icon-button" ng-disabled="true">
      <md-icon md-svg-icon="clipboard-check"></md-icon>
    </md-button>`
};
