import angular from "angular";

class AddToClipboardController {
    constructor($mdToast, $sharing, $clipboard) {
        this._$mdToast = $mdToast;
        this.$clipboard = $clipboard;
        this.visible = false;
        this.type = undefined;
        this.value = undefined;

        $sharing.onShareChange(targets => {
            const providedEntries = Object.entries($sharing.provided);

            if (providedEntries.length === 1 && $clipboard.isAllowed(providedEntries[0][0])){
                [this.type, this.value] = providedEntries[0];
                this.visible = this.type && this.value;
            } else {
                this.visible = false;

                this.type = undefined;
                this.value = undefined;
            }
        });
    }

    add() {
        if (!(this.type && this.value)){
            return;
        }

        if (this.value instanceof Array){
            this.showToast('Don\'t know how to handle multiple items.');
            return;
        }

        const added = this.$clipboard.add(this.type, this.value);

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
        // value: '<'
    },
    template: `
    <md-button ng-show="$ctrl.visible" class="md-icon-button" ng-click="$ctrl.add()">
      <md-icon md-svg-icon="clipboard-plus"></md-icon>
    </md-button>`
};
