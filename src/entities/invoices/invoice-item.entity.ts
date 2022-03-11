import {
    BaseEntity, Entity,
    Column, JoinColumn,
    ManyToOne
} from 'typeorm';

import Invoice from './invoice.entity';
import Product from '../product.entity';

@Entity({ name: 'invoice_items' })
export default class InvoiceItem extends BaseEntity {

    @ManyToOne(
        () => Invoice,
        (invoice) => invoice.invoiceItems,
        { primary: true }
    )
    @JoinColumn({ name: 'invoice_id' })
    invoice!: Invoice;

    @ManyToOne(
        () => Product,
        (product) => product.invoiceItems,
        { primary: true }
    )
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @Column({ name: 'current_price' })
    currentPrice!: number;

    @Column({ default: 1 })
    quantity!: number;

}