import angular from "angular";
import {ShoppingCartToolbarComponent} from "./shopping-cart-toolbar.component";
import {AddToShoppingCartComponent} from "./add-to-shopping-cart.component.js";
import panelTemplate from "./shopping-cart-panel.html";

import iconCart from "../../../../img/icons/cart.svg";
import iconCartPlus from "../../../../img/icons/cart-plus.svg";
import iconClearAll from "../../../../img/icons/clear-all.svg";


class ShoppingCartRegistryProvider {
    constructor() {
        this.sources = {};
    }

    register(name, config) {
        this.sources[name] = config;
    }

    $get($injector) {
        return this.sources;
    }
}


class ShoppingCartProvider {
    constructor($localStorageProvider, shoppingCartRegistryProvider) {
        this._localStorageProvider = $localStorageProvider;
        this._shoppingCartRegistryProvider = shoppingCartRegistryProvider;

        this.loadFromCache();

    }

    loadFromCache() {
        let itemsFromCache = this._localStorageProvider.get('shoppingCartAllItems');
        this.items = itemsFromCache ? JSON.parse(itemsFromCache) : [];

        this.selectedItems = JSON.parse(this._localStorageProvider.get('shoppingCartSelectedItems') || "{}");
    }

    updateCache() {
        this._localStorageProvider.set(
            'shoppingCartAllItems',
            JSON.stringify(this.items)
        );

        this._localStorageProvider.set(
            'shoppingCartSelectedItems',
            JSON.stringify(this.selectedItems)
        );
    }

    clear() {
        this.items = [];
        this.selectedItems = [];

        this.updateCache();
    }

    addItem(newItem) {
        const itemType = newItem.constructor.name;
        console.log(this._shoppingCartRegistryProvider);
        const config = this._shoppingCartRegistryProvider.sources[itemType];

        console.log(config);
        if (!config) {
            return;
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            if (item.id === newItem.id) {
                return
            }
        }

        this.items.push(Object.assign({}, newItem, {__shoppingCartItemType: itemType}));

        this.updateCache();
    }

    $get($injector) {
        return {
            items: this.items,
            selectedItems: this.selectedItems,
            clear: this.clear,
            addItem: this.addItem,
            updateCache: this.updateCache,
        };
    }
}


export const ShoppingCartModule = angular.module('shoppingCart', [])
    .provider('shoppingCartRegistry', ShoppingCartRegistryProvider)
    .provider('shoppingCart', ShoppingCartProvider)
    .factory('shoppingCartPanel', function ($transitions, $mdPanel, shoppingCart, shoppingCartRegistry) {
        $transitions.onStart({}, () => {
            closePanels();
        });

        let panels = [];

        function closePanels() {
            for (let panel of panels) {
                panel.close();
            }

            panels = [];
        }

        return function (event) {
            class ShoppingCartPanelController {
                constructor() {
                    this.items = angular.copy(shoppingCart.items);
                    this.selectedItems = [];
                }

                groupItemsByType() {
                    if (this.groups) {
                        return this.groups;
                    }
                    this.groups = new Map();

                    this.items.forEach(item => {
                        const itemType = item.__shoppingCartItemType;
                        if (!itemType) {
                            return;
                        }


                        if (!this.groups.has(itemType)) {
                            const config = shoppingCartRegistry[itemType];
                            if (!config) {
                                return;
                            }

                            this.groups.set(itemType, {
                                type: itemType,
                                icon: config.icon,
                                items: [],
                            });
                        }

                        this.groups.get(itemType)['items'].push(item);

                    });

                    return Array.from(this.groups.values());
                }


            }

            let animation = $mdPanel.newPanelAnimation()
                .withAnimation($mdPanel.animation.FADE);

            let position = $mdPanel.newPanelPosition()
                .relativeTo(event.target)
                .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
                .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.ABOVE)
                .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.CENTER)
                .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW)
                .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.ABOVE)
                .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.CENTER);

            $mdPanel.open({
                animation,
                attachTo: angular.element(document.body),
                controllerAs: '$ctrl',
                position,
                openFrom: event,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: false,
                zIndex: 91,
                controller: ShoppingCartPanelController,
                template: panelTemplate
            });
        };
    })
    .component('shoppingCartToolbar', ShoppingCartToolbarComponent)
    .component('addToShoppingCart', AddToShoppingCartComponent)
    .config(function ($mdIconProvider) {
        $mdIconProvider.icon('cart', iconCart, 24);
        $mdIconProvider.icon('cart-plus', iconCartPlus, 24);
        $mdIconProvider.icon('clear-all', iconClearAll, 24);
    })
    .config(function (shoppingCartRegistryProvider) {
        shoppingCartRegistryProvider.register('Experiment', {
            name: 'experiment',
            pluralName: 'experiments',

            state: 'app.project.experiment',

            stateParams(experiment) {
                return {projectId: experiment.project.id, experimentId: experiment.id};
            },

            formatAsText(experiment) {
                return experiment.title || experiment.identifier;
            }
        });
    });
