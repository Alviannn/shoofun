import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import Invoice from './invoices/invoice.entity';
import Cart from './carts/cart.entity';

@Entity({ name: 'users' })
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 16 })
    username!: string;

    @Column({ length: 64 })
    email!: string;

    @Column({ length: 64 })
    password!: string;

    @Column({ name: 'display_name', length: 64 })
    displayName!: string;

    @Column({ name: 'phone_number', length: 64 })
    phoneNumber!: string;

    @OneToMany(() => Invoice, (invoice) => invoice.user)
    invoices!: Invoice[];

    @OneToMany(() => Cart, (cart) => cart.user)
    carts!: Cart[];

}