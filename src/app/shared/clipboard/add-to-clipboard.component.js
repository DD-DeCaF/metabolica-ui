class AddToClipboardController {
    constructor($mdToast, $clipboard) {
        this._$mdToast = $mdToast;
        this.$clipboard = $clipboard;

        this.$clipboard.onClipboardChange(() => {
            this.visible = !this.checkIfAdded(this.type, this.value);
        });
    }

    $onInit(){
        this.visible = !this.checkIfAdded(this.type, this.value);
    }

    checkIfAdded(type, item){
        const items = this.$clipboard.itemGroups[type];

        if (items === undefined){
            return false;
        }

        for (let i = 0; i < items.length; i++) {
            const _item = items[i];

            if (_item.$uri === item.$uri) {
                // This item already exists on the clipboard
                return true;
            }
        }

        return false;
    }

    add(type, value) {
        if (!(this.type && this.value)){
            return;
        }

        if (!this.$clipboard.isAllowed(type)){
            this.showToast('Clipboard does not support this object type.');
            return;
        } else if (this.checkIfAdded(type, value)){
            this.showToast('Already exists on the clipboard.');
            return;
        }

        this.$clipboard.add(type, value);
        this.showToast('Added to the clipboard.');
    }

    showToast(msg){
        this._$mdToast.show(this._$mdToast.simple().textContent(msg).hideDelay(2000));
    }
}

export const AddToClipboardComponent = {
    controller: AddToClipboardController,
    bindings: {
        type: '<',
        value: '<',
    },
    template: `
    <md-button ng-show="$ctrl.visible" class="md-icon-button" ng-click="$ctrl.add($ctrl.type, $ctrl.value)">
      <md-icon md-svg-icon="clipboard-plus"></md-icon>
    </md-button>`
};
