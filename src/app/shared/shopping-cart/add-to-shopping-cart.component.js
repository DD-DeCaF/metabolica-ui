class AddToShoppingCartController {
    constructor(shoppingCart) {
        this._shoppingCart = shoppingCart;
    }

    addToCart(item) {
        this._shoppingCart.addItem(item);
    }
}

export const AddToShoppingCartComponent = {
    controller: AddToShoppingCartController,
    bindings: {
        item: '<'
    },
    template: `
    <md-button ng-click="$ctrl.addToCart($ctrl.item)">
      <md-icon md-svg-icon="cart-plus"></md-icon>
    </md-button>`
};
