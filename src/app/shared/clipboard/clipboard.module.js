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
        this.items = [];

        this._triggerOnChange();
    }

    add(type, value) {
        this.items.push([type, value]);
        this._triggerOnChange();
    }

    remove(type, value) {
        this.items = this.items.filter(([itemType, itemValue]) => !(itemType === type && itemValue.$uri === value.$uri));

        this._triggerOnChange();
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

class ClipboardProvider {
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
