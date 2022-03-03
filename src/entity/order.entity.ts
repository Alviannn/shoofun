import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { Receipt } from './receipt.entity';

@Entity({ name: 'orders' })
export class Order {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @OneToOne(() => Item)
    @JoinColumn()
    item!: Item;

    @ManyToOne(() => Receipt)
    @JoinColumn()
    receipt!: Receipt;

}