import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Receipt } from './receipt.entity';

@Entity({ name: 'orders' })
export class Order {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @OneToOne(() => Product)
    @JoinColumn()
    product!: Product;

    @ManyToOne(() => Receipt)
    @JoinColumn()
    receipt!: Receipt;

}