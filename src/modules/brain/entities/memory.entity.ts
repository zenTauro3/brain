import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '@/modules/users/user.entity'; 
import { Embedding } from './embedding.entity';

export enum MemoryCategory {
  PREFERENCE = 'PREFERENCE',
  FACT = 'FACT',
  GOAL = 'GOAL',
  RELATIONSHIP = 'RELATIONSHIP',
  EVENT = 'EVENT', 
  OTHER = 'OTHER',
}

@Entity('memories')
export class Memory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'text', enum: MemoryCategory, default: MemoryCategory.OTHER })
  category!: MemoryCategory;

  @Column({ type: 'text' })
  key!: string;

  @Column({ type: 'text' })
  value!: string; 

  @Column({ type: 'float', name: 'importance_score', default: 0.5 })
  importanceScore!: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.memories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Embedding, (embedding) => embedding.memory)
  embeddings!: Embedding[];
}