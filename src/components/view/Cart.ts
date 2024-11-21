import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

// класс Cart, который отвечает за отображение карточки товара + обработчики событий.

export interface ICart {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  updateHeaderCartCounter(value: number): void;
  updateTotalPrice(sumAll: number): void;
  renderCart(): HTMLElement;
}

export class Cart implements ICart {
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
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  updateHeaderCartCounter(value: number) {
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

