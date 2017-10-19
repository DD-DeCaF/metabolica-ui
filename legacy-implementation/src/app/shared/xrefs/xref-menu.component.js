class XRefMenuController {
	constructor(xrefMenuPanel) {
		this._xrefMenuPanel = xrefMenuPanel;
	}

	openMenu(event, item, type) {
		this._xrefMenuPanel(event, item, type);
		//event.stopPropagation();
	}
}

export const XRefMenuComponent = {
    template: `
    <span class="xref-menu-open-button" ng-click="$ctrl.openMenu($event, $ctrl.value, $ctrl.type)">
      <ng-transclude>{{ $ctrl.value.identifier || $ctrl.value.barcode || $ctrl.value.toString() }}</ng-transclude>
    </span>`,
    controller: XRefMenuController,
    transclude: true,
    bindings: {
        type: '<',
        value: '<'
    }
};
