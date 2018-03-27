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
