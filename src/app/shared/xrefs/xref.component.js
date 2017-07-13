class XRefController {
	constructor(xrefRegistry) {
		this._xrefRegistry = xrefRegistry;
	}

	$onChanges(changes) {
		if (changes.value) {
            const config = this._xrefRegistry[this.type || this.value.constructor.name];
            if (config) {
                const {state, stateParams} = config(this.value);
                this.state = state;
                this.stateParams = stateParams;
            }
		}
	}
}

export const XRefComponent = {
    template: `
    <a ui-state="$ctrl.state" ui-state-params="$ctrl.stateParams">
      <ng-transclude>{{ $ctrl.value.identifier || $ctrl.value.barcode || $ctrl.value.toString() }}</ng-transclude>
    </a>`,
    controller: XRefController,
    transclude: true,
    bindings: {
        type: '<',
        value: '<'
	}
};
