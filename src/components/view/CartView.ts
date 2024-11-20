import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import {IAction, IProduct} from "../../types";

// класс Card, который отвечает за отображение карточки товара + обработчики событий.

export interface ICartBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  updateHeaderBasketCounter(value: number): void;
  updateTotalPrice(sumAll: number): void;
  renderCart(): HTMLElement;
}

export class CartBasket implements ICartBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    this.headerBasketButton = document.querySelector('.header__basket');
    this.headerBasketCounter = document.querySelector('.header__basket-counter');

    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') });

    this.cartItems = [];
  }

  set cartItems(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.button.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'В корзине ничего нет' }));
    }
  }

  updateHeaderBasketCounter(value: number) {
    this.headerBasketCounter.textContent = String(value);
  }

  updateTotalPrice(total: number) {
    this.basketPrice.textContent = String(total + ' синапсов');
  }

  renderCart() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }
}

// надо разбить на файлы наверное не понятно нужно ли покупать несколько товаров
// можно убрать обработчик бесценно ведь он не доб в коризну
// naming not
export interface IBasketItem {
  basketItem: HTMLElement;
  index:HTMLElement;
  title: HTMLElement;
  price: HTMLElement;
  buttonDelete: HTMLButtonElement;
  render(data: IProduct, item: number): HTMLElement;
}

export class BasketItem implements IBasketItem {
  basketItem: HTMLElement;
  index:HTMLElement;
  title: HTMLElement;
  price: HTMLElement;
  buttonDelete: HTMLButtonElement;

  constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IAction) {
    this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
    this.index = this.basketItem.querySelector('.basket__item-index');
    this.title = this.basketItem.querySelector('.card__title');
    this.price = this.basketItem.querySelector('.card__price');
    this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');

    if (actions?.onClick) {
      this.buttonDelete.addEventListener('click', actions.onClick);
    }
  }

  protected setPrice(value: number | null) {
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }

  render(data: IProduct, item: number) {
    this.index.textContent = String(item);
    this.title.textContent = data.title;
    this.price.textContent = this.setPrice(data.price);
    return this.basketItem;
  }
}