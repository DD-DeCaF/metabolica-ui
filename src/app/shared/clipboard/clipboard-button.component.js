import angular from "angular";

import "./clipboard-panel.scss";

import panelTemplate from "./clipboard-panel.html";

class ClipboardPanelController {
    constructor($clipboard, $sharing, mdPanelRef) {
        this._mdPanelRef = mdPanelRef;
        this.$clipboard = $clipboard;

        this.itemGroups = Array.from(this.$clipboard.itemGroups.values());

        this.sharing = {
            targets: $clipboard.sharingTargets,
            open: state => {
                this._mdPanelRef && this._mdPanelRef.close();
                $sharing.open(state);
            }
        };
    }

    clear() {
        this.itemGroups = [];
        this.$clipboard.clear();
        this._mdPanelRef && this._mdPanelRef.close();
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
            .relativeTo(event.target)
            .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.ABOVE);

        const oldProvided = Object.assign({}, this._$sharing.provided);
        const newProvided = {};
        this.$clipboard.itemGroups.forEach(({items}, type) => {
            if (items.length === 1) {
                newProvided[type] = items[0];
            } else {
                newProvided[type] = items;
            }
        });
        this._$sharing.provide(newProvided);

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
    <md-button layout="row" ng-hide="$ctrl.$clipboard.isEmpty()" aria-label="Shopping Clipboard" class="md-icon-button clipboard-button" ng-click="$ctrl.showClipboard($event)">
      <md-icon md-svg-icon="clipboard"></md-icon>
      <span>({{$ctrl.$clipboard.size}})</span>
    </md-button>`
};
