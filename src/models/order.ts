import Item from './item';

export default class Order {

    id: number;
    receiptId: number;

    item: Item;
    quantity: number;

}