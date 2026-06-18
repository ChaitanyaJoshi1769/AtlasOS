import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dataset } from './dataset.entity';

export enum DataType {
  STRING = 'string',
  INTEGER = 'integer',
  FLOAT = 'float',
  BOOLEAN = 'boolean',
  DATE = 'date',
  TIMESTAMP = 'timestamp',
  JSON = 'json',
  BINARY = 'binary',
}

export enum PiiLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('dataset_columns')
export class DatasetColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('varchar', {
    enum: DataType,
  })
  dataType: DataType;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', {
    enum: PiiLevel,
    default: PiiLevel.NONE,
  })
  piiLevel: PiiLevel;

  @Column('varchar', { nullable: true })
  piiType: string;

  @Column('boolean', { default: false })
  isNullable: boolean;

  @Column('integer', { nullable: true })
  uniqueValues: number;

  @Column('float', { nullable: true })
  nullPercentage: number;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Dataset, (dataset) => dataset.columns, { onDelete: 'CASCADE' })
  @JoinColumn()
  dataset: Dataset;
}
