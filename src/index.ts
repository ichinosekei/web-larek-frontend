import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ShopApi } from './components/Model/ShopApi';
import { ProductDataModel } from './components/Model/ProductDataModel';
import { ProductCard } from './components/view/ProductCard';
import { ProductCardPreview } from './components/view/ProductCardPreview';
import { IOrderForm, IProduct } from './types';
import { ModalWindow } from './components/view/ModalWindow';
import { ensureElement } from './utils/utils';
import { CartModel } from './components/Model/CartModel';
import { Cart } from './components/view/Cart';
import { CartItem } from './components/view/CartItem';
import { OrderFormModel } from './components/Model/OrderFormModel';
import { OrderForm } from './components/view/OrderForm';
import { ContactForm } from './components/view/ContactForm';
import { SuccessMessage } from './components/view/SuccessMessage';

// Получаем ссылки на шаблоны из HTML
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Создаём экземпляры основных классов
const shopApi = new ShopApi(CDN_URL, API_URL);
const events = new EventEmitter();
const productDataModel = new ProductDataModel(events);
const modalWindow = new ModalWindow(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new Cart(basketTemplate, events);
const cartModel = new CartModel();
const orderFormModel = new OrderFormModel(events);
const orderForm = new OrderForm(orderTemplate, events);
const contactForm = new ContactForm(contactsTemplate, events);

// Отображение списка карточек товаров
events.on('productCards:receive', () => {
    productDataModel.productList.forEach(item => {
        const card = new ProductCard(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
        ensureElement<HTMLElement>('.gallery').append(card.render(item));
    });
});

// Получаем данные карточки по которой кликнули
events.on('card:select', (item: IProduct) => { productDataModel.setProductPreview(item); });

// Модальное окно открываем товара
events.on('modalCard:open', (item: IProduct) => {
    const cardPreview = new ProductCardPreview(cardPreviewTemplate, events, cartModel)
    modalWindow.contentElement = cardPreview.render(item);
    modalWindow.render();
});

// Добавляем товар в корзину
events.on('card:addBasket', () => {
    cartModel.addProductsToCart(productDataModel.selectedProduct);
    cart.updateHeaderCartCounter(cartModel.getProductsCount());
    modalWindow.close();
});

// Выполняет обновление отображения корзины, синхронизируя визуальное представление с актуальным состоянием данных корзины.
function updateCartView(){
    cart.updateTotalPrice(cartModel.getTotalPrice());
    let i = 0;
    cart.cartItems= cartModel.cartProducts.map((item) => {
        const basketItem = new CartItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
        i = i + 1;
        return basketItem.render(item, i);
    })
}

// Открывается модальное окно корзины
events.on('basket:open', () => {
    updateCartView()
    modalWindow.contentElement = cart.renderCart();
    modalWindow.render();
});

// Удаляем товар из корзины
events.on('basket:basketItemRemove', (item: IProduct) => {
    cartModel.removeProductsFromCart(item);
    cart.updateHeaderCartCounter(cartModel.getProductsCount());
    updateCartView()
});

// Открываем первое модальное окно оформеления заказа (адресс и способ оплаты)
events.on('order:open', () => {
    modalWindow.contentElement = orderForm.render();
    modalWindow.render();
    orderFormModel.productIds = cartModel.cartProducts.map(item => item.id); // передаём список id товаров которые покупаем
});
// Для способы оплаты отслеживаем
events.on('order:paymentSelection', (button: HTMLButtonElement) => {orderFormModel.setPaymentMethod(button.name); orderFormModel.payment = button.name }) // передаём способ оплаты

// Для адресса отслеживаем
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
    orderFormModel.setDeliveryAddress(data.field, data.value);
});

// Проверка валидации данных
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    orderForm.isValid = !address && !payment;
    orderForm.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

// Открываем второе окно оформеления заказа(телефон email)
events.on('contacts:open', () => {
    orderFormModel.total = cartModel.getTotalPrice();
    modalWindow.contentElement = contactForm.render();
    modalWindow.render();
});

// Отслеживаем телефон и email
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
    orderFormModel.setContactData(data.field, data.value);
});

// Проверка валидации данных
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contactForm.isValid = !email && !phone;
    contactForm.errorElement.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

// Открываем модальное окно Заказ оформлен
events.on('success:open', () => {
    shopApi.submitOrder(orderFormModel.generateOrderPayload())
        .then((data) => {
            console.log(data); // ответ сервера
            const success = new SuccessMessage(successTemplate, events);
            modalWindow.contentElement = success.render(cartModel.getTotalPrice());
            cartModel.clearCartProducts(); // очищаем корзину
            cart.updateHeaderCartCounter(cartModel.getProductsCount()); // отобразить количество товара на иконке корзины
            modalWindow.render();
        })
        .catch(error => console.log(error));
});

events.on('success:close', () => modalWindow.close());

// Запрещаем прокрутку страницы при открытие модального окна
events.on('modal:open', () => {
    modalWindow.isLocked = true;
});

// Разблокируем прокрутку страницы при закрытие модального окна
events.on('modal:close', () => {
    modalWindow.isLocked = false;
});

// Получаем данные с сервера
shopApi.fetchListProductCard()
    .then(function (data: IProduct[]) {
        productDataModel.productList = data;
    })
    .catch(error => console.log(error))