import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import Product from '../product.entity';
import Cart from './cart.entity';

@Entity({ name: 'cart_items' })
export default class CartItem extends BaseEntity {

    @PrimaryColumn()
    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    @JoinColumn()
    cart!: Cart;

    @PrimaryColumn()
    @ManyToOne(() => Product, (product) => product.cartItems)
    @JoinColumn()
    product!: Product;

    @Column({ type: 'integer', default: 1 })
    quantity!: number;

}