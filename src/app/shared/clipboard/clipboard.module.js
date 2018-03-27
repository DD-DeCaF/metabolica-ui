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

import angular from 'angular';

import {ClipboardMenuComponent} from './clipboard-menu.component';
import {AddToClipboardComponent} from './add-to-clipboard.component.js';

import iconClipboardOutline from '../../../../img/icons/clipboard-outline.svg';
import iconClipboardPlus from '../../../../img/icons/clipboard-plus.svg';
import iconClipboardCheck from '../../../../img/icons/clipboard-check.svg';
import iconDelete from '../../../../img/icons/delete.svg';
import iconClearAll from '../../../../img/icons/clear-all.svg';


class Clipboard {
    constructor(registry) {
        this.registry = registry;
        this.items = [];
        this.hooks = new Set();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    canAdd(type) {
        return this.registry[type] !== undefined;
    }

    clear() {
        const oldItemsCount = this.items.length;
        this.items = [];

        if (oldItemsCount > 0) {
            this._triggerOnChange();
        }
    }

    add(type, value) {
        this.items.push([type, value]);
        this._triggerOnChange();
    }

    remove(type, value) {
        const oldItemsCount = this.items.length;
        this.items = this.items.filter(([itemType, itemValue]) => !(itemType === type && itemValue.$uri === value.$uri));

        if (this.items.length < oldItemsCount) {
            this._triggerOnChange();
        }
    }

    onChange(hookFn) {
        this.hooks.add(hookFn);
    }

    offChange(hookFn) {
        this.hooks.delete(hookFn);
    }

    _triggerOnChange() {
        for (const hookFn of this.hooks) {
            hookFn();
        }
    }

    getItemsOfType(type) {
        return this.items.filter(([itemType,]) => itemType === type);
    }

    getItemsGroupedByType() {
        const itemGroups = {};
        for (const [type, value] of this.items) {
            if (!itemGroups[type]) {
                itemGroups[type] = [value];
            } else {
                itemGroups[type].push(value);
            }
        }
        return itemGroups;
    }
}

export class ClipboardProvider {
    constructor() {
        this.registry = [];
    }

    register(name, config) {
        this.registry[name] = config;
    }

    $get() {
        return new Clipboard(this.registry);
    }
}


export const ClipboardModule = angular.module('clipboard', [])
    .provider('$clipboard', ClipboardProvider)
    .component('clipboardMenu', ClipboardMenuComponent)
    .component('addToClipboard', AddToClipboardComponent)
    .config(function ($mdIconProvider) {
        $mdIconProvider.icon('clipboard-outline', iconClipboardOutline, 24);
        $mdIconProvider.icon('clipboard-plus', iconClipboardPlus, 24);
        $mdIconProvider.icon('clipboard-check', iconClipboardCheck, 24);
        $mdIconProvider.icon('delete', iconDelete, 24);
        $mdIconProvider.icon('clear-all', iconClearAll, 24);
    });
