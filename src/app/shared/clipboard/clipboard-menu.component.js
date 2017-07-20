import angular from "angular";

import "./clipboard-panel.scss";

import panelTemplate from "./clipboard-panel.html";

class ClipboardPanelController {
    constructor($clipboard, $sharing, mdPanelRef) {
        this._mdPanelRef = mdPanelRef;
        this._$clipboard = $clipboard;
        this._$sharing = $sharing;
    }

    open(state) {
        this._mdPanelRef && this._mdPanelRef.close();
        this._$sharing.provide(this._$clipboard.provideForSharing());
        this._$sharing.open(state);
    }

    clear() {
        this._mdPanelRef && this._mdPanelRef.close();
        this._$clipboard.clear();
    }

    getName(type) {
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
        const animation = this._$mdPanel.newPanelAnimation().withAnimation(this._$mdPanel.animation.FADE);

        const position = this._$mdPanel.newPanelPosition()
            .relativeTo(document.querySelector('#clipboard-menu'))
            .addPanelPosition(this._$mdPanel.xPosition.ALIGN_END, this._$mdPanel.yPosition.ABOVE);

        this._$mdPanel.open({
            animation,
            attachTo: angular.element(document.body),
            controllerAs: '$ctrl',
            position,
            openFrom: event,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false,
            zIndex: 91,
            controller: ClipboardPanelController,
            template: panelTemplate
        });
    }
}

export const ClipboardMenuComponent = {
    controller: ClipboardMenuController,
    template: `
    <md-button id="clipboard-menu" layout="row" ng-hide="$ctrl._$clipboard.isEmpty()" aria-label="Clipboard" class="md-icon-button" ng-click="$ctrl.showClipboard($event)">
      <md-icon md-svg-icon="clipboard"></md-icon>
    </md-button>`
};
