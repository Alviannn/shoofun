import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn,
    OneToMany,
    ValueTransformer
} from 'typeorm';

import CartItem from './carts/cart-item.entity';
import InvoiceItem from './invoices/invoice-item.entity';

const decimalTransformer: ValueTransformer = {
    from: (value: string) => parseFloat(value),
    to: (value) => value
};

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

    @Column({ type: 'decimal', scale: 2, transformer: decimalTransformer })
    weight!: number;

    @Column({ name: 'is_deleted', default: false })
    isDeleted!: boolean;

    @OneToMany(() => InvoiceItem, (item) => item.product)
    invoiceItems!: InvoiceItem[];

    @OneToMany(() => CartItem, (item) => item.cart)
    cartItems!: CartItem[];

    toFiltered() {
        const cloned = { ...this } as Record<string, unknown>;
        delete cloned.isDeleted;

        return cloned;
    }

}