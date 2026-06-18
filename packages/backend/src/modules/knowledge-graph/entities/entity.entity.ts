import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Relationship } from './relationship.entity';

export enum EntityType {
  TABLE = 'table',
  COLUMN = 'column',
  BUSINESS_CONCEPT = 'business_concept',
  METRIC = 'metric',
  DIMENSION = 'dimension',
  USER = 'user',
  SYSTEM = 'system',
}

@Entity('kg_entities')
@Index(['name'])
@Index(['type'])
export class KGEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('varchar', {
    enum: EntityType,
  })
  type: EntityType;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  definition: string;

  @Column('varchar', { nullable: true })
  owner: string;

  @Column('text', { nullable: true })
  tags: string;

  @Column('jsonb', { nullable: true })
  properties: Record<string, any>;

  @Column('float', { default: 1.0 })
  confidence: number;

  @Column('integer', { default: 0 })
  usageCount: number;

  @OneToMany(() => Relationship, (rel) => rel.sourceEntity)
  outgoingRelationships: Relationship[];

  @OneToMany(() => Relationship, (rel) => rel.targetEntity)
  incomingRelationships: Relationship[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
