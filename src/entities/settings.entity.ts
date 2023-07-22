import { BaseEntity, Entity } from 'typeorm';

@Entity()
export class SettingEntity extends BaseEntity implements Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
