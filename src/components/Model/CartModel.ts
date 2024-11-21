import { IProduct } from "../../types";

// реализует класс CartModel, который отвечает за управление состоянием корзины товаров в приложении.
// Он предоставляет методы для добавления, удаления, очистки товаров в корзине, подсчёта общего количества и суммы товаров.

export interface ICartModel {
    cartProducts: IProduct[];
    getProductsCount: () => number;
    getTotalPrice: () => number;
    addProductsToCart(data: IProduct): void;
    removeProductsFromCart(item: IProduct): void;
    clearCartProducts(): void
}

export class CartModel implements ICartModel {
    protected _cartProducts: IProduct[]; // список карточек товара в корзине

    constructor() {
        this._cartProducts = [];
    }

    set cartProducts(data: IProduct[]) {
        this._cartProducts = data;
    }

    get cartProducts() {
        return this._cartProducts;
    }

    // количество товара в корзине
    getProductsCount() {
        return this.cartProducts.length;
    }

    // сумма всех товаров в корзине
    getTotalPrice() {
        let sumAll = 0;
        this.cartProducts.forEach(item => {
            sumAll = sumAll + item.price;
        });
        return sumAll;
    }

    // добавить карточку товара в корзину
    addProductsToCart(data: IProduct) {
        this._cartProducts.push(data);
    }
    // Проверка, находится ли товар в корзине
    isProductsInCart(productId: string): boolean {
        return this._cartProducts.some(item => item.id === productId);
    }


    // удалить карточку товара из корзины
    removeProductsFromCart(item: IProduct) {
        const index = this._cartProducts.indexOf(item);
        if (index >= 0) {
            this._cartProducts.splice(index, 1);
        }
    }

    clearCartProducts() {
        this.cartProducts = []
    }
}