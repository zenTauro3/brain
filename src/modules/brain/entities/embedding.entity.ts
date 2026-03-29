import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { Memory } from './memory.entity';

@Entity('embeddings')
export class Embedding {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid', name: 'memory_id', nullable: true })
  memoryId?: string;

  @Column({ type: 'vector', transformer: {
    to: (value: number[]) => value ? `[${value.join(',')}]` : null,
    from: (value: any) => value
  }, nullable: true })
  vector?: number[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Memory, (memory) => memory.embeddings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memory_id' })
  memory?: Memory;
}