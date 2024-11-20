import { IEvents } from "../base/events";

// Этот код реализует класс Success, который отвечает за отображение сообщения об успешном завершении операции (например, оформления заказа).
// Это модульный компонент, который отображает общее количество списанных "синапсов" (условной валюты) и позволяет закрыть сообщение через кнопку.

export interface ISuccess {
    success: HTMLElement;
    description: HTMLElement;
    button: HTMLButtonElement;
    render(total: number): HTMLElement;
}

export class Success {
    success: HTMLElement;
    description: HTMLElement;
    button: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.success = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
        this.description = this.success.querySelector('.order-success__description');
        this.button = this.success.querySelector('.order-success__close');

        this.button.addEventListener('click', () => { events.emit('success:close') });
    }

    render(total: number) {
        this.description.textContent = String(`Стоимостью ${total} синапсов`);
        return this.success
    }
}