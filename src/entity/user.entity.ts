import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Receipt } from './receipt.entity';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 16 })
    username!: string;

    @Column({ length: 64 })
    email!: string;

    @Column({ length: 64 })
    password!: string;

    @Column({ length: 64 })
    display!: string;

    @Column({ length: 64 })
    phone!: string;

    @OneToMany(() => Receipt, (receipt) => receipt.user)
    @JoinColumn()
    receipts!: Receipt[];

}