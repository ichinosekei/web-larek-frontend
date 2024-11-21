
import {IAction, IProduct} from "../../types";
import {IEvents} from "../base/events";

export interface ICartItem {
    container: HTMLElement;
    index:HTMLElement;
    title: HTMLElement;
    price: HTMLElement;
    buttonDelete: HTMLButtonElement;
    render(data: IProduct, item: number): HTMLElement;
}

export class CartItem implements ICartItem {
    container: HTMLElement;
    index:HTMLElement;
    title: HTMLElement;
    price: HTMLElement;
    buttonDelete: HTMLButtonElement;

    constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IAction) {
        this.container = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
        this.index = this.container.querySelector('.basket__item-index');
        this.title = this.container.querySelector('.card__title');
        this.price = this.container.querySelector('.card__price');
        this.buttonDelete = this.container.querySelector('.basket__item-delete');

        if (actions?.onClick) {
            this.buttonDelete.addEventListener('click', actions.onClick);
        }
    }

    protected formatPrice(value: number | null) {
        return String(value) + ' синапсов'
    }

    render(data: IProduct, item: number) {
        this.index.textContent = String(item);
        this.title.textContent = data.title;
        this.price.textContent = this.formatPrice(data.price);
        return this.container;
    }
}