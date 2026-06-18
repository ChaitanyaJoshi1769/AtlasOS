import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { KGEntity } from './entity.entity';

export enum RelationType {
  DEPENDS_ON = 'depends_on',
  DERIVED_FROM = 'derived_from',
  RELATED_TO = 'related_to',
  SYNONYM_OF = 'synonym_of',
  MEASURES = 'measures',
  FILTERS = 'filters',
  DEFINED_BY = 'defined_by',
  USES = 'uses',
}

@Entity('kg_relationships')
@Index(['sourceEntity', 'targetEntity', 'type'])
export class Relationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => KGEntity, (entity) => entity.outgoingRelationships)
  @JoinColumn()
  sourceEntity: KGEntity;

  @ManyToOne(() => KGEntity, (entity) => entity.incomingRelationships)
  @JoinColumn()
  targetEntity: KGEntity;

  @Column('varchar', {
    enum: RelationType,
  })
  type: RelationType;

  @Column('text', { nullable: true })
  description: string;

  @Column('float', { default: 1.0 })
  strength: number;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
