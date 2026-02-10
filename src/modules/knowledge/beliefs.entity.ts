import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('beliefs')
export class BeliefEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'text' })
  belief!: string;

  @Column({ type: 'float', nullable: true })
  confidence?: number;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
