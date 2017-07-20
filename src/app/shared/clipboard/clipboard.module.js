import angular from "angular";
import {ClipboardButtonComponent} from "./clipboard-button.component";
import {AddToClipboardComponent} from "./add-to-clipboard.component.js";

import iconClipboard from "../../../../img/icons/clipboard.svg";
import iconClipboardPlus from "../../../../img/icons/clipboard-plus.svg";
import iconClearAll from "../../../../img/icons/clear-all.svg";


class ClipboardProvider {
    static itemGroups = {};
    static selectedItemGroups = {};
    static registry = {};

    constructor($sharingProvider) {
        this._$sharingProvider = $sharingProvider;
    }

    register(name, config) {
        ClipboardProvider.registry[name] = config;
    }

    $get($injector) {
        const hooks = [];
        const $sharingProvider = this._$sharingProvider;

        class Clipboard {
            get registry() {
                return ClipboardProvider.registry;
            }

            get itemGroups() {
                return ClipboardProvider.itemGroups;
            }

            get selectedItemGroups() {
                return ClipboardProvider.selectedItemGroups;
            }

            updateSelection() {
                ClipboardProvider.selectedItemGroups = {};

                for(const [type, items] of Object.entries(this.itemGroups)) {
                    const selectedItems = items.filter(item => item.$selected === true);
                    if (!selectedItems.length) {
                        return;
                    }

                    ClipboardProvider.selectedItemGroups[type] = selectedItems;
                }
            }

            get size() {
                if (Object.entries(this.itemGroups).length === 0) {
                    return 0;
                } else {
                    return Object.values(this.itemGroups).reduce((sum, items) => sum + items.length, 0);
                }
            }

            get sharingTargets() {
                return $sharingProvider.registry.filter(({_name, accept}) =>
                    accept.some(({type, multiple}) => this.selectedItemGroups[type] !== undefined && (multiple || !(this.selectedItemGroups[type].length > 1))
                    ));
            }

            isEmpty() {
                return this.size === 0;
            }

            isAllowed(type){
                return ClipboardProvider.registry[type] !== undefined;
            }

            clear() {
                ClipboardProvider.itemGroups = {};
                ClipboardProvider.selectedItemGroups = {};

                this.triggerOnClipboardChange();
            }

            add(type, item) {
                if (ClipboardProvider.registry[type] === undefined) {
                    return;
                } else if (this.itemGroups[type] === undefined){
                    ClipboardProvider.itemGroups[type] = [];
                }

                this.itemGroups[type].push(Object.assign({}, item, {$selected: true}));

                this.triggerOnClipboardChange();
            }

            onClipboardChange(hookFn) {
                hooks.push(hookFn);
            }

            triggerOnClipboardChange() {
                this.updateSelection();

                for(const hookFn of hooks){
                    hookFn();
                }
            }

            provideForSharing() {
                const provided = {};
                for(const [type, items] of Object.entries(this.selectedItemGroups)) {
                    if (items.length === 1) {
                        provided[type] = items[0];
                    } else {
                        provided[type] = items;
                    }
                }
                return provided;
            }
        }

        return new Clipboard();
    }
}


export const ClipboardModule = angular.module('clipboard', [])
    .provider('$clipboard', ClipboardProvider)
    .component('clipboardButton', ClipboardButtonComponent)
    .component('addToClipboard', AddToClipboardComponent)
    .config(function ($mdIconProvider) {
        $mdIconProvider.icon('clipboard', iconClipboard, 24);
        $mdIconProvider.icon('clipboard-plus', iconClipboardPlus, 24);
        $mdIconProvider.icon('clear-all', iconClearAll, 24);
    });
