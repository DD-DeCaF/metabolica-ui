import template from "./shopping-cart-toolbar.component.html";
import "./shopping-cart-toolbar.component.scss";


class ShoppingCartToolbarController {
    constructor(shoppingCart, shoppingCartPanel) {
        this._shoppingCart = shoppingCart;
        this._shoppingCartPanel = shoppingCartPanel;
    }

    showShoppingCart(event) {
        this._shoppingCartPanel(event);
    }
}

export const ShoppingCartToolbarComponent = {
    controller: ShoppingCartToolbarController,
    transclude: true,
    template
};
