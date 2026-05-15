import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class Company {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        unique: true,
        nullable: true,
    })
    slug!: string;

    @Column()
    email!: string;

    @Column()
    phone!: string;

    @Column({
        nullable: true,
    })
    website?: string;

    @Column({
        nullable: true,
    })
    logo_url?: string;

    @Column({
        default: 'active',
    })
    status!: string;

    @Column({
        default: false,
    })
    is_deleted!: boolean;

    @Column({
        nullable: true,
    })
    created_by?: number;

    @Column({
        nullable: true,
    })
    updated_by?: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}