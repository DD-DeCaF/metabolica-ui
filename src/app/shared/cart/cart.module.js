import angular from "angular";
import {CartButtonComponent} from "./cart-button.component";
import {AddToCartComponent} from "./add-to-cart.component.js";

import iconCart from "../../../../img/icons/cart.svg";
import iconCartPlus from "../../../../img/icons/cart-plus.svg";
import iconClearAll from "../../../../img/icons/clear-all.svg";


class CartRegistryProvider {
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


class CartProvider {
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

        class Cart {
            get itemGroups() {
                return CartProvider.itemGroups;
            }

            get selectedItems() {
                return CartProvider.selectedItems;
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
                CartProvider.itemGroups = new Map();
                CartProvider.selectedItems = [];

                this._triggerOnCartChange();
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

                this._triggerOnCartChange();

                return true;
            }

            onCartChange(hookFn) {
                hooks.push(hookFn);
            }

            _triggerOnCartChange() {
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

        return new Cart();
    }
}


export const CartModule = angular.module('cart', [])
    .provider('cartRegistry', CartRegistryProvider)
    .provider('$cart', CartProvider)
    .component('cartButton', CartButtonComponent)
    .component('addToCart', AddToCartComponent)
    .config(function ($mdIconProvider) {
        $mdIconProvider.icon('cart', iconCart, 24);
        $mdIconProvider.icon('cart-plus', iconCartPlus, 24);
        $mdIconProvider.icon('clear-all', iconClearAll, 24);
    })
    .config(function (cartRegistryProvider) {
        cartRegistryProvider.register('experiment', {
            name: 'experiment',
            pluralName: 'experiments'
        });

        cartRegistryProvider.register('pool', {
            name: 'pool',
            pluralName: 'pools'
        });
    });
