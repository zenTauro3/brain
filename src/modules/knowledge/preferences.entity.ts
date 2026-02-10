import { Entity, Column, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('preferences')
@Unique(['userId', 'category'])
export class PreferenceEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId!: number;

  @Column({ type: 'text' })
  category!: string;

  @Column({ type: 'jsonb' })
  value!: any;

  @Column({ type: 'float', default: 1.0 })
  strength!: number;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
