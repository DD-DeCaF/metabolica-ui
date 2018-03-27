// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class XRefController {
	constructor(xrefRegistry) {
		this._xrefRegistry = xrefRegistry;
	}

	$onChanges() {
		if (this.value) {
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
