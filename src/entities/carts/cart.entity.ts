import {
    Entity, BaseEntity,
    PrimaryGeneratedColumn, JoinColumn, Column,
    ManyToOne, OneToMany
} from 'typeorm';

import User from '../user.entity';
import CartItem from './cart-item.entity';

export enum Status {
    IN_USE,
    PROCESSED,
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
    status!: Status;

    @OneToMany(() => CartItem, (item) => item.cart)
    cartItems!: CartItem[];

}