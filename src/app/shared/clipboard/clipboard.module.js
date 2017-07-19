import angular from "angular";
import {ClipboardButtonComponent} from "./clipboard-button.component";
import {AddToClipboardComponent} from "./add-to-clipboard.component.js";

import iconClipboard from "../../../../img/icons/clipboard.svg";
import iconClipboardPlus from "../../../../img/icons/clipboard-plus.svg";
import iconClearAll from "../../../../img/icons/clear-all.svg";


class ClipboardProvider {
    static itemGroups = new Map();
    static selectedItemGroups = new Map();
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
            get itemGroups() {
                return ClipboardProvider.itemGroups;
            }

            get selectedItemGroups() {
                return ClipboardProvider.selectedItemGroups;
            }

            updateSelection() {
                ClipboardProvider.selectedItemGroups = new Map();

                this.itemGroups.forEach((value, type) => {
                    const items = value['items'].filter(item => item.selected === true);
                    if (!items.length) {
                        return
                    }

                    ClipboardProvider.selectedItemGroups.set(type, Object.assign({}, value, {items}));
                });
            }

            get size() {
                if (this.itemGroups.size === 0) {
                    return 0;
                } else {
                    return Array.from(this.itemGroups.values()).reduce((sum, {items}) => sum + items.length, 0);
                }
            }

            get sharingTargets() {
                return $sharingProvider.registry.filter(({_name, accept}) =>
                    accept.some(({type, multiple}) => this.selectedItemGroups.get(type) !== undefined && (multiple || !(this.selectedItemGroups.get(type)['items'].length > 1))
                    ));
            }

            isEmpty() {
                return this.size === 0;
            }

            isAllowed(type){
                return ClipboardProvider.registry[type] !== undefined;
            }

            clear() {
                ClipboardProvider.itemGroups = new Map();

                this._triggerOnClipboardChange();
            }

            add(type, newItem) {
                // type is not registered with $cartProvider
                if (ClipboardProvider.registry[type] === undefined) {
                    return;
                }

                if (!this.itemGroups.has(type)) {
                    const config = ClipboardProvider.registry[type];

                    this.itemGroups.set(type, {
                        name: config.name,
                        pluralName: config.pluralName,
                        type,
                        items: [],
                    });
                } else {
                    const items = this.itemGroups.get(type)['items'];

                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];

                        if (item.item.$uri === newItem.$uri) {
                            // This item already exists on the clipboard
                            return false;
                        }
                    }
                }

                // Add this item to the clipboard
                this.itemGroups.get(type)['items'].push({
                    selected: true,
                    item: newItem,
                });

                // Trigger any code related to clipboard change
                this.triggerOnClipboardChange();

                return true;
            }

            triggerOnClipboardChange() {
                this.updateSelection();
            }

            provideForSharing() {
                const provided = {};
                this.selectedItemGroups.forEach(({items}, type) => {
                    if (items.length === 1) {
                        provided[type] = items[0].item;
                    } else {
                        provided[type] = items.map(item => item.item);
                    }
                });
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
    })
    .config(function ($clipboardProvider) {
        $clipboardProvider.register('experiment', {
            name: 'Experiment',
            pluralName: 'Experiments'
        });

        $clipboardProvider.register('pool', {
            name: 'Pool',
            pluralName: 'Pools'
        });
    });
