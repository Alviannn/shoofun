import User from './user';
import Order from './order';

export default class Receipt {

    id: number;
    user: User;
    purchaseDate: Date;
    orders: Order[];

}