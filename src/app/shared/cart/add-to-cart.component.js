import angular from "angular";

class AddToCartController {
    constructor($mdToast, $cart) {
        this._$mdToast = $mdToast;
        this.$cart = $cart;
    }

    add(value) {
        const added = this.$cart.add(value.constructor.name.toLowerCase(), value);

        if (added) {
            this.showAddedToast();
        } else {
            this.showAlreadyExistsToast();
        }
    }

    showAddedToast() {
        this._$mdToast.show(
            this._$mdToast.simple()
                .textContent('Added to the cart!')
                .position('bottom right')
                .hideDelay(3000)
        );
    }

    showAlreadyExistsToast() {
        this._$mdToast.show(
            this._$mdToast.simple()
                .textContent('Already exists in the cart!')
                .position('bottom right')
                .hideDelay(3000)
        );
    }
}

export const AddToCartComponent = {
    controller: AddToCartController,
    bindings: {
        value: '<'
    },
    template: `
    <md-button class="md-icon-button" ng-click="$ctrl.add($ctrl.value)">
      <md-icon md-svg-icon="cart-plus"></md-icon>
    </md-button>`
};
