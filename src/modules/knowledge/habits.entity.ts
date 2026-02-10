import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('habits')
export class HabitEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'text' })
  habit!: string;

  @Column({ type: 'text', nullable: true })
  frequency?: string;

  @Column({ type: 'float', nullable: true })
  confidence?: number;

  @Column({ type: 'timestamptz', name: 'last_observed_at', nullable: true })
  lastObservedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
