import { DateTime } from 'luxon';
import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn,
    JoinColumn, ManyToOne, OneToMany,
    ValueTransformer
} from 'typeorm';

import User from '../user.entity';
import InvoiceItem from './invoice-item.entity';

const dateTransformer: ValueTransformer = {
    from: (date: Date) => DateTime.fromJSDate(date),
    to: (date: DateTime) => date.toJSDate()
};

@Entity({ name: 'invoices' })
export default class Invoice extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.invoices)
    @JoinColumn()
    user!: User;

    @Column({
        name: 'purchase_date',
        type: 'timestamp',
        transformer: dateTransformer,
        default: DateTime.utc()
    })
    purchaseDate!: DateTime;

    @OneToMany(() => InvoiceItem, (item) => item.invoice)
    invoiceItems!: InvoiceItem[];

}