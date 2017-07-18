import angular from "angular";
import {ClipboardButtonComponent} from "./clipboard-button.component";
import {AddToClipboardComponent} from "./add-to-clipboard.component.js";

import iconClipboard from "../../../../img/icons/clipboard.svg";
import iconClipboardPlus from "../../../../img/icons/clipboard-plus.svg";
import iconClearAll from "../../../../img/icons/clear-all.svg";


class ClipboardRegistryProvider {
    constructor() {
        this.sources = {};
    }

    $get($injector) {
        return this.sources;
    }

    register(name, config) {
        this.sources[name] = config;
    }
}


class ClipboardProvider {
    static itemGroups = new Map();
    static selectedItems = [];

    constructor($sharingProvider) {
        this._$sharingProvider = $sharingProvider;
    }

    $get($injector) {
        let provided = {};
        let transfer = {};
        let hooks = [];
        let $sharingProvider = this._$sharingProvider;

        class Clipboard {
            get itemGroups() {
                return ClipboardProvider.itemGroups;
            }

            get selectedItems() {
                return ClipboardProvider.selectedItems;
            }

            get size(){
                if (this.itemGroups.size === 0){
                    return 0;
                } else {
                    return Array.from(this.itemGroups.values()).reduce((sum, {items}) => sum + items.length, 0);
                }
            }

            isEmpty(){
                return this.size === 0;
            }

            clear() {
                ClipboardProvider.itemGroups = new Map();
                ClipboardProvider.selectedItems = [];

                this._triggerOnClipboardChange();
            }

            add(type, newItem) {
                if (!this.itemGroups.has(type)) {
                    this.itemGroups.set(type, {
                        type,
                        items: [],
                    });
                } else {
                    const items = this.itemGroups.get(type)['items'];

                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];

                        if (item.$uri === newItem.$uri) {
                            return false;
                        }
                    }
                }

                this.itemGroups.get(type)['items'].push(newItem);

                this._triggerOnClipboardChange();

                return true;
            }

            onClipboardChange(hookFn) {
                hooks.push(hookFn);
            }

            _triggerOnClipboardChange() {
                let targets = this.sharingTargets;
                for (let hookFn of hooks) {
                    hookFn(targets);
                }
            }

            get sharingTargets() {
                return $sharingProvider.registry.filter(({_name , accept}) =>
                    accept.some(({type, multiple}) => this.itemGroups.get(type) !== undefined && (multiple || !(this.itemGroups.get(type)['items'].length > 1))
                    ));
            }
        }

        return new Clipboard();
    }
}


export const ClipboardModule = angular.module('clipboard', [])
    .provider('clipboardRegistry', ClipboardRegistryProvider)
    .provider('$clipboard', ClipboardProvider)
    .component('clipboardButton', ClipboardButtonComponent)
    .component('addToClipboard', AddToClipboardComponent)
    .config(function ($mdIconProvider) {
        $mdIconProvider.icon('clipboard', iconClipboard, 24);
        $mdIconProvider.icon('clipboard-plus', iconClipboardPlus, 24);
        $mdIconProvider.icon('clear-all', iconClearAll, 24);
    })
    .config(function (clipboardRegistryProvider) {
        clipboardRegistryProvider.register('experiment', {
            name: 'experiment',
            pluralName: 'experiments'
        });

        clipboardRegistryProvider.register('pool', {
            name: 'pool',
            pluralName: 'pools'
        });
    });
