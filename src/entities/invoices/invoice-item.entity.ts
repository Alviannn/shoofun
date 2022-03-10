import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import Invoice from './invoice.entity';
import Product from '../product.entity';

@Entity({ name: 'invoice_items' })
export default class InvoiceItem extends BaseEntity {

    @PrimaryColumn()
    @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems)
    @JoinColumn()
    invoice!: Invoice;

    @PrimaryColumn()
    @ManyToOne(() => Product, (product) => product.invoiceItems)
    @JoinColumn()
    product!: Product;

    @Column({ name: 'current_price' })
    currentPrice!: number;

    @Column({ default: 1 })
    quantity!: number;

}