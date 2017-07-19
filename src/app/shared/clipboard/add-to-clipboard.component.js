import angular from "angular";

class AddToClipboardController {
    constructor($mdToast, $clipboard) {
        this._$mdToast = $mdToast;
        this.$clipboard = $clipboard;
    }

    add(value) {
        const added = this.$clipboard.add(value.constructor.name.toLowerCase(), value);

        if (added === true) {
            this.showToast('Added to the clipboard.');
        } else if (added === false) {
            this.showToast('Already exists on the clipboard.');
        } else {
            this.showToast('Clipboard does not support this object type.');
        }
    }

    showToast(msg){
        this._$mdToast.show(
            this._$mdToast.simple()
                .textContent(msg)
                .position('bottom right')
                .hideDelay(3000)
        );
    }
}

export const AddToClipboardComponent = {
    controller: AddToClipboardController,
    bindings: {
        value: '<'
    },
    template: `
    <md-button class="md-icon-button" ng-click="$ctrl.add($ctrl.value)">
      <md-icon md-svg-icon="clipboard-plus"></md-icon>
    </md-button>`
};
