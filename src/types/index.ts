// Интерфейс, описывающий данные о продукте
export interface IProduct {
    id: string;           // Уникальный идентификатор товара
    title: string;        // Название товара
    description: string;  // Описание товара
    image: string;        // URL изображения товара
    category: string;     // Категория товара
    price: number | null; // Цена товара; может быть null, если цена не указана
}

// Интерфейс для описания заказа
export interface IOrder extends IOrderForm {
    items: string[]; // Массив идентификаторов товаров, включённых в заказ
}

// Интерфейс для описания результата выполнения заказа
export interface IOrderResult {
    id: string;      // Идентификатор заказа
    total: number;   // Общая стоимость заказа
}

// Интерфейс для описания действий (например, клика на элемент)
export interface IAction {
    onClick: (event: MouseEvent) => void; // Обработчик клика на элемент
}

// Тип для ошибок формы. Позволяет ассоциировать каждое поле формы с текстом ошибки
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс, описывающий форму заказа
export interface IOrderForm {
    payment?: string; // Способ оплаты
    address?: string; // Адрес доставки
    phone?: string;   // Телефон клиента
    email?: string;   // Электронная почта клиента
    total?: string | number; // Общая стоимость заказа
}
