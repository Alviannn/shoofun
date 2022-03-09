import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn, BaseEntity } from 'typeorm';
import Receipt from './receipt.entity';

@Entity({ name: 'users' })
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 16 })
    username!: string;

    @Column({ length: 64 })
    email!: string;

    @Column({ length: 64 })
    password!: string;

    @Column({ length: 64 })
    displayName!: string;

    @Column({ length: 64 })
    phoneNumber!: string;

    @OneToMany(() => Receipt, (receipt) => receipt.user)
    @JoinColumn()
    receipts!: Receipt[];

}