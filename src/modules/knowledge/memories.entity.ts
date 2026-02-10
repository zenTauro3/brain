import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('memories')
export class MemoryEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'text', nullable: true })
  title?: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  category?: string;

  @Column({ type: 'int', nullable: true })
  emotionalWeight?: number;

  @Column({ type: 'boolean', default: false })
  isPersistent!: boolean;

  @Column({ type: 'timestamptz', name: 'valid_until', nullable: true })
  validUntil?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
