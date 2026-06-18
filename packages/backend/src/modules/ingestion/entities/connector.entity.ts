import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IngestionRun } from './ingestion-run.entity';

export enum ConnectorType {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  MONGODB = 'mongodb',
  S3 = 's3',
  CSV = 'csv',
  PARQUET = 'parquet',
  SALESFORCE = 'salesforce',
  HUBSPOT = 'hubspot',
  JIRA = 'jira',
  GITHUB = 'github',
  NOTION = 'notion',
  GOOGLE_DRIVE = 'google_drive',
  KAFKA = 'kafka',
  REST_API = 'rest_api',
  WEBHOOK = 'webhook',
}

export enum ConnectorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  TESTING = 'testing',
}

@Entity('connectors')
export class Connector {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('varchar', {
    enum: ConnectorType,
  })
  type: ConnectorType;

  @Column('text', { nullable: true })
  description: string;

  @Column('jsonb')
  config: Record<string, any>;

  @Column('jsonb', { nullable: true })
  credentials: Record<string, any>;

  @Column('varchar', {
    enum: ConnectorStatus,
    default: ConnectorStatus.ACTIVE,
  })
  status: ConnectorStatus;

  @Column('integer', { default: 0 })
  totalSyncs: number;

  @Column('timestamp', { nullable: true })
  lastSyncAt: Date;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column('text', { nullable: true })
  errorMessage: string;

  @OneToMany(() => IngestionRun, (run) => run.connector)
  ingestionRuns: IngestionRun[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
