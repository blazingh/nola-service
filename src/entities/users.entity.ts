import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id!: number;

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
  password!: string;

  @Column({
    default: 'user',
  })
  @IsNotEmpty()
  role!: string;

  @Column({
    default: true,
  })
  @IsNotEmpty()
  active!: boolean;

  @Column({
    default: false,
  })
  @IsNotEmpty()
  emailVerified!: boolean;

  @Column({
    default: false,
  })
  @IsNotEmpty()
  phoneVerified!: boolean;

  @Column({
    default: false,
  })
  @IsNotEmpty()
  adminVerified!: boolean;

  @Column()
  @DeleteDateColumn()
  deletedAt!: Date;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({
    nullable: true,
  })
  resetPasswordToken!: string;

  @Column({
    nullable: true,
  })
  verifyEmailToken!: string;

  @Column({
    nullable: true,
  })
  verifyPhoneToken!: string;

  @Column({
    nullable: true,
  })
  twoFactorCode!: string;

  @Column({
    nullable: true,
  })
  twoFactorCodeExpire!: Date;

  @Column({
    default: false,
  })
  @IsNotEmpty()
  twoFactorEnabled!: boolean;
}
