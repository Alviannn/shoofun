import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity({ name: 'receipts' })
export class Receipt {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('date')
    purchaseDate!: Date;

    @ManyToOne(() => User, (user) => user.receipts)
    @JoinColumn()
    user!: User;

    @OneToMany(() => Order, (order) => order.receipt)
    orders!: Order[];

}