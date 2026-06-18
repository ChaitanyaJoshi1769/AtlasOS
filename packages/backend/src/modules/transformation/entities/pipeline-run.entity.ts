import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pipeline } from './pipeline.entity';

export enum PipelineRunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('pipeline_runs')
export class PipelineRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pipeline, (pipeline) => pipeline.runs)
  @JoinColumn()
  pipeline: Pipeline;

  @Column('varchar', {
    enum: PipelineRunStatus,
    default: PipelineRunStatus.PENDING,
  })
  status: PipelineRunStatus;

  @Column('integer', { default: 0 })
  durationMs: number;

  @Column('integer', { default: 0 })
  recordsProcessed: number;

  @Column('integer', { default: 0 })
  recordsWritten: number;

  @Column('text', { nullable: true })
  errorMessage: string;

  @Column('jsonb', { nullable: true })
  executionPlan: Record<string, any>;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  startedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;
}
