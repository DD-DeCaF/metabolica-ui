import angular from "angular";

class AddToClipboardController {
    constructor($mdToast, $clipboard) {
        this._$mdToast = $mdToast;
        this.$clipboard = $clipboard;
    }

    add(value) {
        const added = this.$clipboard.add(value.constructor.name.toLowerCase(), value);

        if (added) {
            this.showAddedToast();
        } else {
            this.showAlreadyExistsToast();
        }
    }

    showAddedToast() {
        this._$mdToast.show(
            this._$mdToast.simple()
                .textContent('Added to the clipboard!')
                .position('bottom right')
                .hideDelay(3000)
        );
    }

    showAlreadyExistsToast() {
        this._$mdToast.show(
            this._$mdToast.simple()
                .textContent('Already exists on the clipboard!')
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
