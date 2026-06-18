import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Connector } from './connector.entity';

export enum IngestionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('ingestion_runs')
export class IngestionRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Connector, (connector) => connector.ingestionRuns)
  connector: Connector;

  @Column('varchar', {
    enum: IngestionStatus,
    default: IngestionStatus.PENDING,
  })
  status: IngestionStatus;

  @Column('integer', { default: 0 })
  recordsProcessed: number;

  @Column('integer', { default: 0 })
  recordsFailed: number;

  @Column('integer')
  durationMs: number;

  @Column('text', { nullable: true })
  errorMessage: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  startedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;
}
