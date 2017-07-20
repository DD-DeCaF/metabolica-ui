import angular from "angular";

import "./clipboard-panel.scss";

import panelTemplate from "./clipboard-panel.html";

class ClipboardPanelController {
    constructor($clipboard, $sharing, mdPanelRef) {
        this._mdPanelRef = mdPanelRef;
        this._$clipboard = $clipboard;
        this._$sharing = $sharing;

        this._$clipboard.onClipboardChange(() => {
            this.updateSharing();
        });

        this.updateSharing();
    }

    updateSharing(){
        this.sharing = {
            targets: this._$clipboard.sharingTargets,
            open: state => {
                this._mdPanelRef && this._mdPanelRef.close();
                this._$sharing.open(state);
            }
        };
        this._$sharing.provide(this._$clipboard.provideForSharing());
    }

    clear() {
        this._mdPanelRef && this._mdPanelRef.close();
        this._$clipboard.clear();
    }

    getName(type){
        const items = this._$clipboard.itemGroups[type];
        const config = this._$clipboard.registry[type];

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

class ClipboardMenuController {
    constructor($clipboard, $mdPanel, $sharing) {
        this._$clipboard = $clipboard;
        this._$mdPanel = $mdPanel;
        this._$sharing = $sharing;
    }

    showClipboard(event) {
        const $mdPanel = this._$mdPanel;

        let animation = $mdPanel.newPanelAnimation()
            .withAnimation($mdPanel.animation.FADE);

        let position = $mdPanel.newPanelPosition()
            .relativeTo(document.querySelector('#clipboard-menu'))
            .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.ABOVE);

        const oldProvided = Object.assign({}, this._$sharing.provided);
        this._$sharing.provide(this._$clipboard.provideForSharing());

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

export const ClipboardMenuComponent = {
    controller: ClipboardMenuController,
    transclude: true,
    template: `
    <md-button id="clipboard-menu" layout="row" ng-hide="$ctrl._$clipboard.isEmpty()" aria-label="Clipboard" class="md-icon-button" ng-click="$ctrl.showClipboard($event)">
      <md-icon md-svg-icon="clipboard"></md-icon>
    </md-button>`
};
