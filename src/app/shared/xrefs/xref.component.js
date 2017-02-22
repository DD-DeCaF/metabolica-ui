class XRefController {
	constructor(xrefRegistry) {
		this._xrefRegistry = xrefRegistry;
	}

	$onChanges() {
		if (this.value) {
			let config = this._xrefRegistry[this.value.constructor.name];

			if (config) {
				let {state, stateParams} = config(this.value);
				this.state = state;
				this.stateParams = stateParams;
			} else {
				this.state = null;
				this.stateParams = null;
			}
		}
	}
}

export const XRefComponent = {
	template: '<a ui-state="$ctrl.state" ui-state-params="$ctrl.stateParams"><ng-transclude>{{ $ctrl.value.identifier }}</ng-transclude></a>',
	controller: XRefController,
	transclude: true,
	bindings: {
		value: '<'
	}
};
