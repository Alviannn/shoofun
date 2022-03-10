import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import Product from '../product.entity';
import Cart from './cart.entity';

@Entity({ name: 'cart_items' })
export default class CartItem extends BaseEntity {

    @ManyToOne(
        () => Cart,
        (cart) => cart.cartItems,
        { primary: true }
    )
    @JoinColumn({ name: 'cart_id' })
    cart!: Cart;

    @ManyToOne(
        () => Product,
        (product) => product.cartItems,
        { primary: true }
    )
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @Column({ type: 'integer', default: 1 })
    quantity!: number;

}