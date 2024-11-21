import { ApiListResponse, Api } from '../base/api'
import { IOrder, IOrderResult, IProduct} from '../../types';

// предоставляет методы для взаимодействия с API интернет-магазина.
// Этот класс отвечает за получение списка товаров (карточек) с сервера и отправку заказа на сервер.
export interface IShopApi {
    cdnUrl: string; // Базовый URL для загрузки изображений
    productList: IProduct[]; // Массив товаров полученных с сервера.
    fetchListProductCard: () => Promise<IProduct[]>;
    submitOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class ShopApi extends Api implements IShopApi {
    cdnUrl: string;
    productList: IProduct[];

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdnUrl = cdn;
    }

    //  Метод для получения списка товаров
    fetchListProductCard(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdnUrl + item.image,
            }))
        );
    }

    // Метод для отправки заказа
    submitOrder(order: IOrder): Promise<IOrderResult> {
        return this.post(`/order`, order).then((data: IOrderResult) => data);
    }
}