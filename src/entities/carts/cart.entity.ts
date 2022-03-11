import {
    Entity, BaseEntity,
    PrimaryGeneratedColumn, JoinColumn, Column,
    ManyToOne, OneToMany
} from 'typeorm';

import User from '../user.entity';
import CartItem from './cart-item.entity';

export enum CartStatus {
    /**
     * Cart is currently being used.
     *
     * As long as this status exists, the user cannot create a new cart
     * and they must use this cart until they decide
     * to either purchase or cancel it.
     */
    IN_USE,
    /**
     * Cart is no longer used because user has done the purchase.
     *
     * This states the cart is DONE being used and
     * the user can finally create a new cart.
     */
    PROCESSED,
    /**
     * Cart is no longer used because user has cancelled the purchase.
     *
     * It's pretty much the same as the {@link PROCESSED},
     * the only difference is the reason.
     */
    CANCELLED
}

@Entity({ name: 'carts' })
export default class Cart extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'bit' })
    status!: CartStatus;

    @OneToMany(() => CartItem, (item) => item.cart)
    cartItems!: CartItem[];

}