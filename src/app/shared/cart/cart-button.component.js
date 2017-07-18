import angular from "angular";

import "./cart-panel.scss";

import panelTemplate from "./cart-panel.html";

class CartPanelController {
    constructor($cart, $sharing, mdPanelRef) {
        this._mdPanelRef = mdPanelRef;
        this.$cart = $cart;

        this.itemGroups = Array.from(this.$cart.itemGroups.values());

        this.sharing = {
            targets: $cart.sharingTargets,
            open: state => {
                this._mdPanelRef && this._mdPanelRef.close();
                $sharing.open(state);
            }
        };
    }

    clear() {
        this.itemGroups = [];
        this.$cart.clear();
        this._mdPanelRef && this._mdPanelRef.close();
    }
}

class CartButtonController {
    constructor($cart, $mdPanel, $sharing) {
        this.$cart = $cart;
        this._$mdPanel = $mdPanel;
        this._$sharing = $sharing;
    }

    showShoppingCart(event) {
        const $mdPanel = this._$mdPanel;

        let animation = $mdPanel.newPanelAnimation()
            .withAnimation($mdPanel.animation.FADE);

        console.log(event.target);

        let position = $mdPanel.newPanelPosition()
            .relativeTo(event.target)
            .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.ABOVE);

        const oldProvided = Object.assign({}, this._$sharing.provided);
        const newProvided = {};
        this.$cart.itemGroups.forEach(({items}, type) => {
            if (items.length === 1) {
                newProvided[type] = items[0];
            } else {
                newProvided[type] = items;
            }
        });
        this._$sharing.provide(newProvided);

        $mdPanel.open({
            animation,
            attachTo: angular.element(document.body),
            controllerAs: '$ctrl',
            position,
            openFrom: event,
            clickOutsideToClose: true,
            escapeToClose: true,
            onCloseSuccess: (panelRef, closeReason) => {
                this._$sharing.provide(oldProvided);
            },
            focusOnOpen: false,
            zIndex: 91,
            controller: CartPanelController,
            template: panelTemplate
        });
    }
}

export const CartButtonComponent = {
    controller: CartButtonController,
    transclude: true,
    template: `
    <md-button layout="row" ng-hide="$ctrl.$cart.isEmpty()" aria-label="Shopping Cart" class="md-icon-button cart-button" ng-click="$ctrl.showShoppingCart($event)">
      <md-icon md-svg-icon="cart"></md-icon>
      <span>({{$ctrl.$cart.size}})</span>
    </md-button>`
};
