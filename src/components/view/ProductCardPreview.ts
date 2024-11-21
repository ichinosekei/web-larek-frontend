import { ProductCard } from "./ProductCard";
import { IAction, IProduct } from "../../types";
import { IEvents } from "../base/events";
import {CartModel} from "../Model/CartModel"

// класс ProductCardPreview, который расширяет функциональность класса ProductCard.
// Основная цель класса ProductCardPreview — представление карточки товара в предварительном просмотре с добавлением описания и кнопки для покупки,
// которая меняет своё состояние в зависимости от доступности товара для продажи.
//
export interface IProductCardPreview {
    descriptionElement: HTMLElement;
    button: HTMLElement;
    render(data: IProduct): HTMLElement;
}

export class ProductCardPreview extends ProductCard implements IProductCardPreview {
    descriptionElement: HTMLElement;
    button: HTMLElement;
    constructor(template: HTMLTemplateElement, protected events: IEvents, protected basketModel: CartModel, actions?: IAction) {
        super(template, events, actions);
        this.descriptionElement = this._cardElement.querySelector('.card__text');
        this.button = this._cardElement.querySelector('.card__button');
        this.button.addEventListener('click', () => { this.events.emit('card:addBasket') });
    }
    determineActionButtonState(data:IProduct) {
        if (!data.price) {
            this.button.setAttribute('disabled', 'true');
            return 'Не продается';
        }
        if (this.basketModel.isProductsInCart(data.id)) {
            this.button.setAttribute('disabled', 'true');
            return 'В корзине';
        }
        this.button.removeAttribute('disabled');
        return 'Купить';
    }


    render(data: IProduct): HTMLElement {
        super.renderBase(data); // Используем базовый метод для общей части
        this.descriptionElement.textContent = data.description;
        this.button.textContent = this.determineActionButtonState(data);
        return this._cardElement;
    }
}