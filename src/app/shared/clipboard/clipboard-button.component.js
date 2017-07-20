import angular from "angular";

import "./clipboard-panel.scss";

import panelTemplate from "./clipboard-panel.html";

class ClipboardPanelController {
    constructor($clipboard, $sharing, mdPanelRef) {
        this._mdPanelRef = mdPanelRef;
        this.$clipboard = $clipboard;
        this._$sharing = $sharing;

        this.$clipboard.onClipboardChange(() => {
            this.updateSharing();
        });

        this.updateSharing();
    }

    updateSharing(){
        this.sharing = {
            targets: this.$clipboard.sharingTargets,
            open: state => {
                this._mdPanelRef && this._mdPanelRef.close();
                this._$sharing.open(state);
            }
        };
        this._$sharing.provide(this.$clipboard.provideForSharing());
    }

    clear() {
        this._mdPanelRef && this._mdPanelRef.close();
        this.$clipboard.clear();
    }

    getName(type){
        const items = this.$clipboard.itemGroups[type];
        const config = this.$clipboard.registry[type];

        if (config === undefined) {
            return;
        }

        if (items.length === 1) {
            return config.name;
        } else {
            return config.pluralName;
        }
    }
}

class ClipboardButtonController {
    constructor($clipboard, $mdPanel, $sharing) {
        this.$clipboard = $clipboard;
        this._$mdPanel = $mdPanel;
        this._$sharing = $sharing;
    }

    showClipboard(event) {
        const $mdPanel = this._$mdPanel;

        let animation = $mdPanel.newPanelAnimation()
            .withAnimation($mdPanel.animation.FADE);

        let position = $mdPanel.newPanelPosition()
            .relativeTo(document.querySelector('#clipboard-button'))
            .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.ABOVE);

        const oldProvided = Object.assign({}, this._$sharing.provided);
        this._$sharing.provide(this.$clipboard.provideForSharing());

        $mdPanel.open({
            animation,
            attachTo: angular.element(document.body),
            controllerAs: '$ctrl',
            position,
            openFrom: event,
            clickOutsideToClose: true,
            escapeToClose: true,
            onCloseSuccess: (panelRef, closeReason) => {
                this._$sharing.provide(oldProvided);
            },
            focusOnOpen: false,
            zIndex: 91,
            controller: ClipboardPanelController,
            template: panelTemplate
        });
    }
}

export const ClipboardButtonComponent = {
    controller: ClipboardButtonController,
    transclude: true,
    template: `
    <md-button id="clipboard-button" layout="row" ng-hide="$ctrl.$clipboard.isEmpty()" aria-label="Clipboard" class="md-icon-button clipboard-button" ng-click="$ctrl.showClipboard($event)">
      <md-icon md-svg-icon="clipboard"></md-icon>
    </md-button>`
};
