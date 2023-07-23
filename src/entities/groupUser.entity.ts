import { Group } from '@/interfaces/groupUser.interface';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class GroupUserEntity extends BaseEntity implements Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupID: string;

  @Column()
  userId: number;

  @Column()
  userRole?: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
