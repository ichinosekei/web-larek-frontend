import { IProduct } from "../../types";

// реализует класс BasketModel, который отвечает за управление состоянием корзины товаров в приложении.
// Он предоставляет методы для добавления, удаления, очистки товаров в корзине, подсчёта общего количества и суммы товаров.

export interface IBasketModel {
    basketProducts: IProduct[];
    getCounter: () => number;
    getSumAllProducts: () => number;
    setSelectedСard(data: IProduct): void;
    deleteCardToBasket(item: IProduct): void;
    clearBasketProducts(): void
}

export class BasketModel implements IBasketModel {
    protected _basketProducts: IProduct[]; // список карточек товара в корзине

    constructor() {
        this._basketProducts = [];
    }

    set basketProducts(data: IProduct[]) {
        this._basketProducts = data;
    }

    get basketProducts() {
        return this._basketProducts;
    }

    // количество товара в корзине
    getCounter() {
        return this.basketProducts.length;
    }

    // сумма всех товаров в корзине
    getSumAllProducts() {
        let sumAll = 0;
        this.basketProducts.forEach(item => {
            sumAll = sumAll + item.price;
        });
        return sumAll;
    }

    // добавить карточку товара в корзину
    setSelectedСard(data: IProduct) {
        this._basketProducts.push(data);
    }
    // Проверка, находится ли товар в корзине
    isProductInBasket(productId: string): boolean {
        return this._basketProducts.some(item => item.id === productId);
    }


    // удалить карточку товара из корзины
    deleteCardToBasket(item: IProduct) {
        const index = this._basketProducts.indexOf(item);
        if (index >= 0) {
            this._basketProducts.splice(index, 1);
        }
    }

    clearBasketProducts() {
        this.basketProducts = []
    }
}