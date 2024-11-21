

import { IProduct } from "../../types";
import { IEvents } from "../base/events";

// класс ProductDataModel, который управляет данными о продуктах в приложении. Класс выполняет следующие задачи:
//
// Хранение списка продуктов (карточек товаров).
// Управление выбранным продуктом (например, при открытии модального окна с деталями товара).
// Генерация событий для взаимодействия с другими частями приложения.


export interface IProductDataModel {
    productList: IProduct[];
    selectedProduct: IProduct;
    setProductPreview(item: IProduct): void;
}

export class ProductDataModel implements IProductDataModel {
    protected _productList: IProduct[];
    selectedProduct: IProduct;

    constructor(protected events: IEvents) {
        this._productList = []
    }

    set productList(data: IProduct[]) {
        this._productList = data;
        this.events.emit('productCards:receive');
    }

    get productList() {
        return this._productList;
    }

    setProductPreview(product: IProduct) {
        if (!product) return;
        this.selectedProduct = product;
        this.events.emit('modalCard:open', product)
    }
}