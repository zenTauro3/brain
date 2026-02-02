import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('facts')
@Unique(['userId', 'type'])
@Index(['userId', 'type', 'value'])
export class FactEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'text' })
  type!: string;

  @Column({ type: 'text' })
  value!: string;

  @Column({ type: 'float', default: 1.0 })
  confidence!: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
