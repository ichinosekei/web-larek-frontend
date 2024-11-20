import { Card } from "./ProductList";
import { IAction, IProduct } from "../../types";
import { IEvents } from "../base/events";
import {BasketModel} from "../Model/BasketModel"

// наймин и нейминг файла
// класс CardPreview, который расширяет функциональность класса Card.
// Основная цель класса CardPreview — представление карточки товара в предварительном просмотре с добавлением описания и кнопки для покупки, которая меняет своё состояние в зависимости от доступности товара для продажи.
//
export interface ICard {
    text: HTMLElement;
    button: HTMLElement;
    render(data: IProduct): HTMLElement;
}

export class CardPreview extends Card implements ICard {
    text: HTMLElement;
    button: HTMLElement;
    //
    // constructor(template: HTMLTemplateElement, protected events: IEvents, protected basketModel: BasketModel, actions?: IAction) {
    //     super(template, events, actions);
    //     this.text = this._cardElement.querySelector('.card__text');
    //     this.button = this._cardElement.querySelector('.card__button');
    //     this.button.addEventListener('click', () => { this.events.emit('card:addBasket') });
    // }
    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IAction) {
        super(template, events, actions);
        this.text = this._cardElement.querySelector('.card__text');
        this.button = this._cardElement.querySelector('.card__button');
        this.button.addEventListener('click', () => { this.events.emit('card:addBasket') });
    }
    // не факт что work
    notSale(data:IProduct) {
        // if (!data.price) {
        //     this.button.setAttribute('disabled', 'true');
        //     return 'Не продается';
        // }
        // if (this.basketModel.isProductInBasket(data.id)) {
        //     this.button.setAttribute('disabled', 'true');
        //     return 'В корзине';
        // }
        // this.button.removeAttribute('disabled');
        // return 'Купить';
        if(data.price) {
            return 'Купить'
        } else {
            this.button.setAttribute('disabled', 'true')
            return 'Не продается'
        }
    }


    render(data: IProduct): HTMLElement {
        this._cardCategory.textContent = data.category;
        this.cardCategory = data.category;
        this._cardTitle.textContent = data.title;
        this._cardImage.src = data.image;
        this._cardImage.alt = this._cardTitle.textContent;
        this._cardPrice.textContent = this.setPrice(data.price);
        this.text.textContent = data.description;
        this.button.textContent = this.notSale(data);
        return this._cardElement;
    }
}