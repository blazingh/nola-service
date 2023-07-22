import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  @Unique(['email'])
  email!: string;

  @Column({
    nullable: true,
  })
  @Unique(['phone'])
  phone!: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @IsNotEmpty()
  active: boolean;

  @Column()
  @IsNotEmpty()
  emailVerified: boolean;

  @Column()
  @IsNotEmpty()
  phoneVerified: boolean;

  @Column()
  @IsNotEmpty()
  adminVerified: boolean;

  @Column()
  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  resetPasswordToken: string;

  @Column({
    nullable: true,
  })
  verifyEmailToken: string;

  @Column({
    nullable: true,
  })
  verifyPhoneToken: string;
}
