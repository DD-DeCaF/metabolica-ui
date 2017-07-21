import angular from 'angular';
import {ClipboardMenuComponent} from './clipboard-menu.component';
import {AddToClipboardComponent} from './add-to-clipboard.component.js';

import iconClipboard from '../../../../img/icons/clipboard.svg';
import iconClipboardPlus from '../../../../img/icons/clipboard-plus.svg';
import iconClipboardCheck from '../../../../img/icons/clipboard-check.svg';
import iconDelete from '../../../../img/icons/delete.svg';
import iconClearAll from '../../../../img/icons/clear-all.svg';


class ClipboardProvider {
    static itemGroups = {};
    static registry = {};

    register(name, config) {
        ClipboardProvider.registry[name] = config;
    }

    $get($injector) {
        const hooks = [];

        class Clipboard {
            get registry() {
                return ClipboardProvider.registry;
            }

            get itemGroups() {
                return ClipboardProvider.itemGroups;
            }

            getSelectedItemGroups() {
                const selected = {};

                for (const [type, items] of Object.entries(this.itemGroups)) {
                    const selectedItems = items.filter(item => item.$selected === true);
                    if (!selectedItems.length) {
                        continue;
                    }

                    selected[type] = selectedItems;
                }
                return selected;
            }

            get size() {
                if (Object.entries(this.itemGroups).length === 0) {
                    return 0;
                } else {
                    return Object.values(this.itemGroups).reduce((sum, items) => sum + items.length, 0);
                }
            }

            isEmpty() {
                return this.size === 0;
            }

            canAdd(type) {
                return ClipboardProvider.registry[type] !== undefined;
            }

            clear() {
                ClipboardProvider.itemGroups = {};

                this._triggerOnChange();
            }

            add(type, item) {
                if (ClipboardProvider.registry[type] === undefined) {
                    return;
                } else if (this.itemGroups[type] === undefined) {
                    ClipboardProvider.itemGroups[type] = [];
                }

                this.itemGroups[type].push(Object.assign({}, item, {$selected: true}));

                this._triggerOnChange();
            }

            remove(type, item) {
                const items = this.getItems(type);
                const index = items.findIndex(_item => _item.$uri === item.$uri);
                items.splice(index, 1);

                this._triggerOnChange();
            }

            onChange(hookFn) {
                hooks.push(hookFn);
            }

            offChange(hookFn) {
                const index = hooks.indexOf(hookFn);

                if (index > -1) {
                    hooks.splice(index, 1);
                }
            }

            _triggerOnChange() {
                for (const hookFn of hooks) {
                    hookFn();
                }
            }

            getItems(type) {
                return this.itemGroups[type] || [];
            }

            getSelectedItems(type) {
                return this.getItems(type).filter(item => item.$selected === true);
            }

            getAsText(type, item) {
                const config = this.registry[type];

                if (config === undefined) {
                    return;
                }

                return `${config.name} ${item.identifier}`;
            }
        }

        return new Clipboard();
    }
}


export const ClipboardModule = angular.module('clipboard', [])
    .provider('$clipboard', ClipboardProvider)
    .component('clipboardMenu', ClipboardMenuComponent)
    .component('addToClipboard', AddToClipboardComponent)
    .config(function ($mdIconProvider) {
        $mdIconProvider.icon('clipboard', iconClipboard, 24);
        $mdIconProvider.icon('clipboard-plus', iconClipboardPlus, 24);
        $mdIconProvider.icon('clipboard-check', iconClipboardCheck, 24);
        $mdIconProvider.icon('delete', iconDelete, 24);
        $mdIconProvider.icon('clear-all', iconClearAll, 24);
    });
