export interface IProduct {
    id: string;           // Уникальный идентификатор товара
    title: string;        // Название товара
    description: string;  // Описание товара
    image: string;        // URL изображения товара
    category: string;     // Категория товара
    price: number | null; // Цена товара; может быть null, если цена не указана
}

export interface ICategory {
    id: string;    // Уникальный идентификатор категории
    name: string;  // Название категории
}

export interface IOrder {
    items: IOrderItem[]; // Список товаров в заказе
    total: number;      // Общая стоимость заказа
    payment: string;    // Способ оплаты
    address: string;    // Адрес доставки
    email: string;      // Электронная почта покупателя
    phone: string;      // Телефон покупателя
}

export interface IOrderItem {
    productId: string; // Идентификатор товара
    quantity: number;  // Количество единиц товара
}

export interface IOrderResult {
    id: string; // Идентификатор заказа
    total: number; // Общая стоимость заказа
}


export interface IProductListResponse {
    products: IProduct[]; // Массив товаров
}

export interface ICategoryListResponse {
    categories: ICategory[]; // Массив категорий
}
