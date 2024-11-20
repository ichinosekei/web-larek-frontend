import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { DataModel } from './components/Model/DataModel';
import { Card } from './components/view/ProductList';
import { CardPreview } from './components/view/CardPreview';
import { IOrderForm, IProduct } from './types';
import { Modal } from './components/view/Modal';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/Model/BasketModel';
import { CartBasket } from './components/view/CartView';
import { BasketItem } from './components/view/CartView';
import { FormModel } from './components/Model/FormModel';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Success';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new CartBasket(basketTemplate, events);
const basketModel = new BasketModel();
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

/********** Отображения карточек товара на странице **********/
events.on('productCards:receive', () => {
    dataModel.productCards.forEach(item => {
        const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
        ensureElement<HTMLElement>('.gallery').append(card.render(item));
    });
});

/********** Получить объект данных "IProduct" карточки по которой кликнули **********/
events.on('card:select', (item: IProduct) => { dataModel.setPreview(item); });

/********** Открываем модальное окно карточки товара **********/
events.on('modalCard:open', (item: IProduct) => {
    // const cardPreview = new CardPreview(cardPreviewTemplate, events)
    const cardPreview = new CardPreview(cardPreviewTemplate, events, basketModel)
    modal.content = cardPreview.render(item);
    modal.render();
});

/********** Добавление карточки товара в корзину **********/
events.on('card:addBasket', () => {
    basketModel.setSelectedСard(dataModel.selectedСard); // добавить карточку товара в корзину
    basket.updateHeaderBasketCounter(basketModel.getCounter()); // отобразить количество товара на иконке корзины
    modal.close();
});

/********** Открытие модального окна корзины **********/
events.on('basket:open', () => {
    basket.updateTotalPrice(basketModel.getSumAllProducts());  // отобразить сумма всех продуктов в корзине
    let i = 0;
    basket.cartItems= basketModel.basketProducts.map((item) => {
        const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
        i = i + 1;
        return basketItem.render(item, i);
    })
    modal.content = basket.renderCart();
    modal.render();
});

/********** Удаление карточки товара из корзины **********/
events.on('basket:basketItemRemove', (item: IProduct) => {
    basketModel.deleteCardToBasket(item);
    basket.updateHeaderBasketCounter(basketModel.getCounter()); // отобразить количество товара на иконке корзины
    basket.updateTotalPrice(basketModel.getSumAllProducts()); // отобразить сумма всех продуктов в корзине
    let i = 0;
    basket.cartItems = basketModel.basketProducts.map((item) => {
        const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
        i = i + 1;
        return basketItem.render(item, i);
    })
});

/********** Открытие модального окна "способа оплаты" и "адреса доставки" **********/
events.on('order:open', () => {
    modal.content = order.render();
    modal.render();
    formModel.items = basketModel.basketProducts.map(item => item.id); // передаём список id товаров которые покупаем
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => {formModel.setOrderPayment(button.name); formModel.payment = button.name }) // передаём способ оплаты

/********** Отслеживаем изменение в поле в вода "адреса доставки" **********/
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
    formModel.setOrderAddress(data.field, data.value);
});

/********** Валидация данных строки "address" и payment **********/
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    order.valid = !address && !payment;
    order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})
// events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
//     const { address, payment } = errors;
//     order.valid = !address && !payment; // Кнопка активна только если нет ошибок
//     order.formErrors.textContent = Object.values({ address, payment })
//         .filter(Boolean)
//         .join('; ');
// });




/********** Открытие модального окна "Email" и "Телефон" **********/
events.on('contacts:open', () => {
    formModel.total = basketModel.getSumAllProducts();
    modal.content = contacts.render();
    modal.render();
});

/********** Отслеживаем изменение в полях вода "Email" и "Телефон" **********/
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
    formModel.setOrderData(data.field, data.value);
});

/********** Валидация данных строки "Email" и "Телефон" **********/
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

/********** Открытие модального окна "Заказ оформлен" **********/
events.on('success:open', () => {
    apiModel.postOrderLot(formModel.getOrderLot())
        .then((data) => {
            console.log(data); // ответ сервера
            const success = new Success(successTemplate, events);
            modal.content = success.render(basketModel.getSumAllProducts());
            basketModel.clearBasketProducts(); // очищаем корзину
            basket.updateHeaderBasketCounter(basketModel.getCounter()); // отобразить количество товара на иконке корзины
            modal.render();
        })
        .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

/********** Блокируем прокрутку страницы при открытие модального окна **********/
events.on('modal:open', () => {
    modal.locked = true;
});

/********** Разблокируем прокрутку страницы при закрытие модального окна **********/
events.on('modal:close', () => {
    modal.locked = false;
});

/********** Получаем данные с сервера **********/
apiModel.getListProductCard()
    .then(function (data: IProduct[]) {
        dataModel.productCards = data;
    })
    // .then(dataModel.setProductCards.bind(dataModel))
    .catch(error => console.log(error))