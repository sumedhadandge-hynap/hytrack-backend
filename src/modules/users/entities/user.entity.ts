import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;

  @Column({ nullable: true })
  last_name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ nullable: true })
  status?: string;


  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ nullable: true })
  created_by?: number;

  @Column({ nullable: true })
  updated_by?: number;
}