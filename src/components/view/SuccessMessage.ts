import { IEvents } from "../base/events";

export interface ISuccessMessage {
    container: HTMLElement;
    messageText: HTMLElement;
    closeButton: HTMLButtonElement;
    render(total: number): HTMLElement;
}

export class SuccessMessage implements ISuccessMessage {
    container: HTMLElement;
    messageText: HTMLElement;
    closeButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.container = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
        this.messageText = this.container.querySelector('.order-success__description');
        this.closeButton = this.container.querySelector('.order-success__close');

        this.closeButton.addEventListener('click', () => { events.emit('success:close') });
    }

    render(total: number) {
        this.messageText.textContent = String(`Стоимостью ${total} синапсов`);
        return this.container
    }
}