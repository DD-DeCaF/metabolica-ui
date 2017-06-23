class XRefMenuController {
	constructor(xrefMenuPanel) {
		this._xrefMenuPanel = xrefMenuPanel;
	}

	openMenu(event, item) {
		this._xrefMenuPanel(item, event);
		//event.stopPropagation();
	}
}

export const XRefMenuComponent = {
	template: `
	<span class="xref-menu-open-button" ng-click="$ctrl.openMenu($event, $ctrl.value)">
	  <ng-transclude>{{ $ctrl.value.identifier || $ctrl.value.barcode }}</ng-transclude>
    </span>`,
	controller: XRefMenuController,
	transclude: true,
	bindings: {
		value: '<'
	}
};
