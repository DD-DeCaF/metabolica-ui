import angular from 'angular';

import './clipboard-menu-panel.scss';

import panelTemplate from './clipboard-menu-panel.html';

class ClipboardMenuPanelController {
    constructor($clipboard, $sharing, mdPanelRef) {
        this._$clipboard = $clipboard;
        this._$sharing = $sharing;
        this._mdPanelRef = mdPanelRef;
        this.itemGroups = {};
        this.sharingTargets = [];

        for (const [type, items] of Object.entries(this._$clipboard.getItemsGroupedByType())) {
            this.itemGroups[type] = items.map(value => ({
                value,
                selected: true,
                sharingTargets: this._$sharing.findTargets(type)
            }));
        }

        this.onSelectionChange();
    }

    onSelectionChange() {
        this.sharingTargets = this.getSharingTargets();
    }

    getSharingTargets() {
        const selectedItemGroups = this.getSelectedItemGroups();

        return this._$sharing.registry.filter(({_name, accept}) =>
            accept.some(({type, multiple}) => selectedItemGroups[type] !== undefined && (multiple || !(selectedItemGroups[type].length > 1))
            ));
    }

    open(state) {
        if (this._mdPanelRef) {
            this._mdPanelRef.close();
        }

        const selectedItemGroups = this.getSelectedItemGroups();
        const provided = {};

        for (const [type, items] of Object.entries(selectedItemGroups)) {
            if (items.length === 1) {
                provided[type] = items[0].value;
            } else {
                provided[type] = items.map(item => item.value);
            }
        }

        this._$sharing.provide(provided);
        this._$sharing.open(state);
    }

    shareWith(type, value, state) {
        if (this._mdPanelRef) {
            this._mdPanelRef.close();
        }
        this._$sharing.share(type, value, state);
    }

    remove(type, value) {
        this._$clipboard.remove(type, value);
        this.itemGroups[type] = this.itemGroups[type].filter(item => item.value.$uri !== value.$uri);

        if (this._$clipboard.isEmpty()) {
            if (this._mdPanelRef) {
                this._mdPanelRef.close();
            }
        }
    }

    clear() {
        this._$clipboard.clear();
        this.itemGroups = {};

        if (this._mdPanelRef) {
            this._mdPanelRef.close();
        }
    }

    getTypePluralName(type) {
        const config = this._$clipboard.registry[type];
        if (config) {
            return config.pluralName;
        }
    }

    getSelectedItemGroups() {
        return Object.entries(this.itemGroups)
            .map(([type, items]) => [type, items.filter(item => item.selected)])
            .filter(([, items]) => items.length > 0)
            .reduce((result, [type, items]) => {
                result[type] = items;
                return result;
            }, {});
    }
}

class ClipboardMenuController {
    constructor($clipboard, $mdPanel) {
        this._$clipboard = $clipboard;
        this._$mdPanel = $mdPanel;
        this._mdPanelRef = null;

    }

    $onDestroy() {
        if (this._mdPanelRef) {
            this._mdPanelRef.close();
        }
    }

    showClipboardPanel(event) {
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
            controller: ClipboardMenuPanelController,
            template: panelTemplate
        }).then(panelRef => {
            this._mdPanelRef = panelRef;
        });
    }
}

export const ClipboardMenuComponent = {
    controller: ClipboardMenuController,
    template: `
    <md-button id="clipboard-menu" layout="row" ng-hide="$ctrl._$clipboard.isEmpty()" aria-label="Clipboard" class="md-icon-button" ng-click="$ctrl.showClipboardPanel($event)">
      <md-icon md-svg-icon="clipboard-outline"></md-icon>
    </md-button>`
};
