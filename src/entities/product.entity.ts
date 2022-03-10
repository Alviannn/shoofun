import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import CartItem from './carts/cart-item.entity';
import InvoiceItem from './invoices/invoice-item.entity';

@Entity({ name: 'products' })
export default class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 64 })
    name!: string;

    @Column()
    price!: number;

    @Column({ length: 256 })
    description!: string;

    @Column({ type: 'decimal', scale: 2 })
    weight!: number;

    @Column({ name: 'is_deleted' })
    isDeleted!: boolean;

    @OneToMany(() => InvoiceItem, (item) => item.product)
    invoiceItems!: InvoiceItem[];

    @OneToMany(() => CartItem, (item) => item.cart)
    cartItems!: CartItem[];

}