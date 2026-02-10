import { Entity, Column, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('traits')
@Unique(['userId', 'trait'])
export class TraitEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'text' })
  trait!: string;

  @Column({ type: 'float', nullable: true })
  score?: number;

  @Column({ type: 'text', nullable: true })
  source?: string;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
