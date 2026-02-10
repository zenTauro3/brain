import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('embeddings')
export class EmbeddingEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'text', name: 'source_type' })
  sourceType!: string;

  @Column({ type: 'bigint', name: 'source_id', nullable: true })
  sourceId?: number;

  @Column({ type: 'vector', length: 1536 })
  vector!: number[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
