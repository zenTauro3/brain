import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Memory } from '@modules/brain/entities/memory.entity';
import { Embedding } from '@modules/brain/entities/embedding.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text' })
  password!: string;

  @Column({ type: 'text', unique: true, nullable: true })
  username?: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'last_seen_at', nullable: true })
  lastSeenAt?: Date;

  @OneToMany(() => Memory, (memory) => memory.user)
  memories!: Memory[];

  @OneToMany(() => Embedding, (embedding) => embedding.user)
  embeddings!: Embedding[];
}
