import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { DateTime } from 'luxon';

import User from '../user.entity';
import InvoiceItem from './invoice-item.entity';

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
        transformer: {
            from: (date: Date) => DateTime.fromJSDate(date),
            to: (date: DateTime) => date.toJSDate()
        },
        default: DateTime.utc()
    })
    purchaseDate!: DateTime;

    @Column({ type: 'decimal' })
    weight!: number;

    @OneToMany(() => InvoiceItem, (item) => item.invoice)
    invoiceItems!: InvoiceItem[];

}