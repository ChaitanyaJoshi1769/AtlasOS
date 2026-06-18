import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('kg_glossary_terms')
@Index(['term'])
export class GlossaryTerm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  term: string;

  @Column('text')
  definition: string;

  @Column('text', { nullable: true })
  businessOwner: string;

  @Column('text', { nullable: true })
  category: string;

  @Column('text', { nullable: true })
  relatedTerms: string;

  @Column('text', { nullable: true })
  examples: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column('integer', { default: 0 })
  usageCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
