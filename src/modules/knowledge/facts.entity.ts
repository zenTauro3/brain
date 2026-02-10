import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('facts')
@Unique(['userId', 'key'])
export class FactEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'text' })
  key!: string;

  @Column({ type: 'jsonb' })
  value!: any;

  @Column({ type: 'float', default: 1.0 })
  confidence!: number;

  @Column({ type: 'text', nullable: true })
  source?: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
