import {IEvents} from '../base/events';
import {FormErrors} from '../../types'

// Интерфейс для модели формы заказа.
export interface IOrderFormModel {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    productIds: string[];

    setDeliveryAddress(field: string, value: string): void

    validateOrder(): boolean;

    setContactData(field: string, value: string): void

    validateContacts(): boolean;

    generateOrderPayload(): object;
}

export class OrderFormModel implements IOrderFormModel {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    productIds: string[];
    formErrors: FormErrors = {};

    constructor(protected events: IEvents) {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.total = 0;
        this.productIds = [];
    }

    // Установить адрес доставки.
    setDeliveryAddress(field: string, value: string) {
        if (field === 'address') {
            this.address = value;
        }
        this.checkOrderValidity();
    }

    // Установить способ оплаты.
    setPaymentMethod(payment: string) {
        this.payment = payment;
        this.checkOrderValidity();
    }

    // Проверка валидности данных заказа.
    checkOrderValidity() {
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.generateOrderPayload());
        }
    }

    // Проверка валидности адреса доставки и способа оплаты.
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.address) {
            errors.address = 'Необходимо указать адрес'
        }
        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты'
        }

        this.formErrors = errors;
        this.events.emit('formErrors:address', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // Установить контактные данные.
    setContactData(field: string, value: string) {
        if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        }

        if (this.validateContacts()) {
            this.events.emit('order:ready', this.generateOrderPayload());
        }
    }

    // Проверка валидности контактных данных.
    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.email) {
            errors.email = 'Необходимо указать email'
        }
        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон'
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // Сформировать объект заказа.
    generateOrderPayload() {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.productIds,
        }
    }
}