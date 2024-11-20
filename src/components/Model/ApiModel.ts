import { ApiListResponse, Api } from '../base/api'
import { IOrder, IOrderResult, IProduct} from '../../types';

// предоставляет методы для взаимодействия с API интернет-магазина.
// Этот класс отвечает за получение списка товаров (карточек) с сервера и отправку заказа на сервер.
export interface IApiModel {
    cdn: string; // Базовый URL для загрузки изображений
    items: IProduct[]; // Массив товаров полученных с сервера.
    getListProductCard: () => Promise<IProduct[]>;
    postOrderLot: (order: IOrder) => Promise<IOrderResult>;
}

export class ApiModel extends Api {
    cdn: string;
    items: IProduct[];

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    //  Метод для получения списка товаров
    getListProductCard(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    // Метод для отправки заказа
    postOrderLot(order: IOrder): Promise<IOrderResult> {
        return this.post(`/order`, order).then((data: IOrderResult) => data);
    }
}