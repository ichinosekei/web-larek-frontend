

import { IProduct } from "../../types";
import { IEvents } from "../base/events";

// класс DataModel, который управляет данными о продуктах в приложении. Класс выполняет следующие задачи:
//
// Хранение списка продуктов (карточек товаров).
// Управление выбранным продуктом (например, при открытии модального окна с деталями товара).
// Генерация событий для взаимодействия с другими частями приложения.


export interface IDataModel {
    productCards: IProduct[];
    selectedСard: IProduct;
    setPreview(item: IProduct): void;
}

export class DataModel implements IDataModel {
    protected _productCards: IProduct[];
    selectedСard: IProduct;

    constructor(protected events: IEvents) {
        this._productCards = []
    }

    set productCards(data: IProduct[]) {
        this._productCards = data;
        this.events.emit('productCards:receive');
    }

    get productCards() {
        return this._productCards;
    }

    setPreview(item: IProduct) {
        if (!item) return; // Не открывать, если item пустой
        this.selectedСard = item;
        this.events.emit('modalCard:open', item)
    }
}