class AddToCartController {
    constructor($cart) {
        this.$cart = $cart;
    }

    add(value) {
        this.$cart.add(value.constructor.name.toLowerCase(), value);
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
