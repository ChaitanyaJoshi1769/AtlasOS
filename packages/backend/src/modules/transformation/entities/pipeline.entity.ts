import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PipelineRun } from './pipeline-run.entity';

export enum PipelineStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('pipelines')
export class Pipeline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('jsonb')
  dag: {
    nodes: any[];
    edges: any[];
  };

  @Column('varchar', {
    enum: PipelineStatus,
    default: PipelineStatus.DRAFT,
  })
  status: PipelineStatus;

  @Column('integer', { default: 0 })
  totalRuns: number;

  @Column('timestamp', { nullable: true })
  lastRunAt: Date;

  @Column('varchar', { nullable: true })
  schedule: string; // Cron expression

  @Column('jsonb', { nullable: true })
  config: Record<string, any>;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => PipelineRun, (run) => run.pipeline)
  runs: PipelineRun[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
