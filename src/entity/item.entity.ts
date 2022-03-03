import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
export class Item {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 64 })
    name!: string;

    @Column()
    price!: number;

    @Column({ length: 256 })
    description!: string;

}