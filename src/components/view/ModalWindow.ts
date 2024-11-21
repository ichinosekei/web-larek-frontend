import {IEvents} from "../base/events";

export interface IModalWindow {
    open(): void;

    close(): void;

    render(): HTMLElement
}

// нейминг
// класс ModalWindow отвечает за работу модального окна в веб-приложении.
// Он предоставляет функции для открытия, закрытия, установки контента модального окна и управления блокировкой основного контента страницы во время показа модального окна.
//set isLocked(value: boolean) Управляет блокировкой основного контента страницы прокрутки при активном модальном окне.

export class ModalWindow implements IModalWindow {
    protected modalElement: HTMLElement;
    protected closeButtonElement: HTMLButtonElement;
    protected _contentElement: HTMLElement;
    protected _pageWrapperElement: HTMLElement;

    constructor(modalContainer: HTMLElement, protected events: IEvents) {
        this.modalElement = modalContainer;
        this.closeButtonElement = modalContainer.querySelector('.modal__close');
        this._contentElement = modalContainer.querySelector('.modal__content');
        this._pageWrapperElement = document.querySelector('.page__wrapper');

        this.closeButtonElement.addEventListener('click', this.close.bind(this));
        this.modalElement.addEventListener('click', this.close.bind(this));
        this.modalElement.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());
    }

    // принимает элемент разметки которая будет отображаться в "modal__content" модального окна
    set contentElement(value: HTMLElement) {
        this._contentElement.replaceChildren(value);
    }

    // открытие модального окна
    open() {
        this.modalElement.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    // закрытие модального окна
    close() {
        this.modalElement.classList.remove('modal_active');
        this.contentElement = null; // очистка контента в модальном окне
        this.events.emit('modal:close');
    }

    set isLocked(value: boolean) {
        if (value) {
            this._pageWrapperElement.classList.add('page__wrapper_locked');
        } else {
            this._pageWrapperElement.classList.remove('page__wrapper_locked');
        }
    }

    render(): HTMLElement {
        this._contentElement;
        this.open();
        return this.modalElement
    }
}