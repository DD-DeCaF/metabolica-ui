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

export class AddToClipboardController {
    constructor($clipboard) {
        this._$clipboard = $clipboard;
        this.isAdded = false;

        this.clipboardChangeHandler = () => {
            this.checkIfAdded(this.type, this.value);
        };
    }

    $onInit() {
        this._$clipboard.onChange(this.clipboardChangeHandler);
    }

    $onChanges() {
        this.checkIfAdded(this.type, this.value);
    }

    $onDestroy() {
        this._$clipboard.offChange(this.clipboardChangeHandler);
    }

    checkIfAdded(type, value) {
        const items = this._$clipboard.getItemsOfType(type);
        this.isAdded = items.length > 0 && items.some(([, itemValue]) => itemValue.$uri === value.$uri);
    }

    addToClipboard(type, value) {
        if (!(type && value)) {
            return;
        }

        if (!this._$clipboard.canAdd(type)) {
            return;
        }

        this._$clipboard.add(type, value);
    }
}

export const AddToClipboardComponent = {
    controller: AddToClipboardController,
    bindings: {
        type: '@',
        value: '<',
    },
    template: `
    <md-button ng-disabled="$ctrl.isAdded" class="md-icon-button" ng-click="$ctrl.addToClipboard($ctrl.type, $ctrl.value)">
      <md-icon ng-hide="$ctrl.isAdded" md-svg-icon="clipboard-plus"></md-icon>
      <md-icon ng-show="$ctrl.isAdded" md-svg-icon="clipboard-check"></md-icon>
    </md-button>`
};
