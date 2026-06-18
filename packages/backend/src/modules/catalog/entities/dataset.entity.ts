import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Connector } from '../../ingestion/entities/connector.entity';
import { DatasetColumn } from './dataset-column.entity';

@Entity('datasets')
export class Dataset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => Connector)
  @JoinColumn()
  connector: Connector;

  @Column('varchar')
  sourceTable: string;

  @Column('integer', { default: 0 })
  totalRows: number;

  @Column('jsonb')
  schema: Record<string, any>;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column('jsonb', { nullable: true })
  statistics: Record<string, any>;

  @OneToMany(() => DatasetColumn, (column) => column.dataset)
  columns: DatasetColumn[];

  @Column('timestamp', { nullable: true })
  lastAnalyzedAt: Date;

  @Column('varchar', { nullable: true })
  dataProfile: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
