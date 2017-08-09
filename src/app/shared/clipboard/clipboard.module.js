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
        this.hooks = [];
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
        this.items = this.items.filter(([itemType, itemValue]) => !(itemType === type  && itemValue.$uri === value.$uri));

        this._triggerOnChange();
    }

    onChange(hookFn) {
        this.hooks.push(hookFn);
    }

    offChange(hookFn) {
        const index = this.hooks.indexOf(hookFn);

        if (index > -1) {
            this.hooks.splice(index, 1);
        }
    }

    _triggerOnChange() {
        for (const hookFn of this.hooks) {
            hookFn();
        }
    }

    getItemsOfType(type) {
        return this.items.filter(([itemType, itemValue]) => itemType === type);
    }

    getItemsGroupedByType() {
        const itemGroups = {};

        this.items.forEach(([type, value]) => {
            if (itemGroups[type] === undefined) {
                itemGroups[type] = [];
            }
            itemGroups[type].push(value);
        });

        return itemGroups;
    }
}

class ClipboardProvider {
    constructor(){
        this.registry = [];
    }

    register(name, config) {
        this.registry[name] = config;
    }

    $get($injector) {
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
