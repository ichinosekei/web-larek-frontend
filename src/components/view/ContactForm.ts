import { IEvents } from "../base/events";

// класс ContactForm, который отвечает за управление формой для ввода контактной информации пользователя и обработку взаимодействий с этой формой.
// Он позволяет отслеживать изменения данных в полях, валидировать форму и обрабатывать её отправку.


export interface IContactForm {
    formElement: HTMLFormElement;
    inputElements: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    errorElement: HTMLElement;
    render(): HTMLElement;
}

export class ContactForm implements IContactForm {
    formElement: HTMLFormElement;
    inputElements: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    errorElement: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.formElement = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
        this.inputElements = Array.from(this.formElement.querySelectorAll('.form__input'));
        this.buttonSubmit = this.formElement.querySelector('.button');
        this.errorElement = this.formElement.querySelector('.form__errors');

        this.inputElements.forEach(item => {
            item.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                const fieldName = target.name;
                const fieldValue = target.value;
                this.events.emit(`contacts:changeInput`, { field: fieldName, value: fieldValue });
            })
        })

        this.formElement.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('success:open');
        });
    }

    set isValid(value: boolean) {
        this.buttonSubmit.disabled = !value;
    }

    render() {
        return this.formElement
    }
}