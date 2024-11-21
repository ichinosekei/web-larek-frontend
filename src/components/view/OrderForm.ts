import { IEvents } from "../base/events";


// класс OrderForm, который управляет формой заказа.
// Основная цель этого класса — обработка выбора способа оплаты, управления валидацией формы, обработки ввода данных и отправки формы.
export interface IOrderForm {
    buttonAll: HTMLButtonElement[];
    formErrors: HTMLElement;
    orderFormElement: HTMLFormElement;
    selectedPaymentMethod: string;

    render(): HTMLElement;
}

export class OrderForm implements IOrderForm {
    orderFormElement: HTMLFormElement;
    buttonAll: HTMLButtonElement[];
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.orderFormElement = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
        this.buttonAll = Array.from(this.orderFormElement.querySelectorAll('.button_alt'));
        this.buttonSubmit = this.orderFormElement.querySelector('.order__button');
        this.formErrors = this.orderFormElement.querySelector('.form__errors');

        this.buttonAll.forEach(item => {
            item.addEventListener('click', () => {
                this.selectedPaymentMethod = item.name;
                events.emit('order:paymentSelection', item);
            });
        });

        this.orderFormElement.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit(`order:changeAddress`, { field, value });
        });

        this.orderFormElement.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('contacts:open');
        });
    }

    // устанавливаем обводку вокруг выбранного метода оплаты
    set selectedPaymentMethod(paymentMethod: string) {
        this.buttonAll.forEach(item => {
            item.classList.toggle('button_alt-active', item.name === paymentMethod);
        })
    }

    set isValid(value: boolean) {
        this.buttonSubmit.disabled = !value;
    }

    render() {
        return this.orderFormElement
    }
}