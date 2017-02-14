
class XRefController {
    constructor(xrefMenuPanel) {
        this._xrefMenuPanel = xrefMenuPanel;
    }

    openMenu(event, item) {
        this._xrefMenuPanel(item, event);
        event.stopPropagation();
    }
}

export const XRefComponent = {
    template: '<span class="xref-menu-open-button" ng-click="$ctrl.openMenu($event, $ctrl.value)">{{ $ctrl.value.identifier }}</span>',
    controller: XRefController,
    bindings: {
        value: '<'
    }
};