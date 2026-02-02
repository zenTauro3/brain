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

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'simple-array', nullable: true, name: 'embedding' })
  embedding!: number[];

  @Column({ type: 'int', default: 1 })
  importance!: number;

  @Column({ type: 'float', default: 1.0 })
  confidence!: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
