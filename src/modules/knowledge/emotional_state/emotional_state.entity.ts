import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('emotional_state')
export class EmotionalStateEntity {
  @PrimaryColumn({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'text', nullable: true })
  mood?: string;

  @Column({ type: 'int', nullable: true })
  intensity?: number;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
