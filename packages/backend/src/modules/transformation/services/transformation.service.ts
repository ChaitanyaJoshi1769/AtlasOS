import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pipeline, PipelineStatus } from '../entities/pipeline.entity';
import { PipelineRun, PipelineRunStatus } from '../entities/pipeline-run.entity';

@Injectable()
export class TransformationService {
  constructor(
    @InjectRepository(Pipeline)
    private pipelineRepository: Repository<Pipeline>,
    @InjectRepository(PipelineRun)
    private pipelineRunRepository: Repository<PipelineRun>,
  ) {}

  async createPipeline(
    name: string,
    description: string,
    dag: { nodes: any[]; edges: any[] },
  ): Promise<Pipeline> {
    const pipeline = this.pipelineRepository.create({
      name,
      description,
      dag,
      status: PipelineStatus.DRAFT,
    });

    return this.pipelineRepository.save(pipeline);
  }

  async findAll(): Promise<Pipeline[]> {
    return this.pipelineRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Pipeline> {
    return this.pipelineRepository.findOne({ where: { id } });
  }

  async updatePipeline(
    id: string,
    updates: Partial<Pipeline>,
  ): Promise<Pipeline> {
    await this.pipelineRepository.update(id, updates);
    return this.findOne(id);
  }

  async validateDag(dag: { nodes: any[]; edges: any[] }): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    if (!dag.nodes || dag.nodes.length === 0) {
      errors.push('DAG must have at least one node');
    }

    if (!dag.edges) {
      dag.edges = [];
    }

    // Validate nodes
    for (const node of dag.nodes || []) {
      if (!node.id) {
        errors.push('Node must have an id');
      }
      if (!node.type) {
        errors.push(`Node ${node.id} must have a type`);
      }
      if (!node.data) {
        errors.push(`Node ${node.id} must have data`);
      }
    }

    // Validate edges
    for (const edge of dag.edges || []) {
      const sourceExists = dag.nodes?.some((n) => n.id === edge.source);
      const targetExists = dag.nodes?.some((n) => n.id === edge.target);

      if (!sourceExists) {
        errors.push(`Edge source ${edge.source} does not exist`);
      }
      if (!targetExists) {
        errors.push(`Edge target ${edge.target} does not exist`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async executePipeline(id: string): Promise<PipelineRun> {
    const pipeline = await this.findOne(id);

    const run = this.pipelineRunRepository.create({
      pipeline,
      status: PipelineRunStatus.PENDING,
      durationMs: 0,
    });

    const saved = await this.pipelineRunRepository.save(run);

    // Queue execution job
    // This would typically be sent to a job queue like Bull

    return saved;
  }

  async getPipelineRuns(pipelineId: string): Promise<PipelineRun[]> {
    return this.pipelineRunRepository.find({
      where: { pipeline: { id: pipelineId } },
      order: { startedAt: 'DESC' },
    });
  }

  async updateRunStatus(
    runId: string,
    status: PipelineRunStatus,
    metadata?: Record<string, any>,
  ): Promise<PipelineRun> {
    const run = await this.pipelineRunRepository.findOne({ where: { id: runId } });

    run.status = status;
    if (metadata) {
      run.metadata = metadata;
    }

    if (
      status === PipelineRunStatus.SUCCESS ||
      status === PipelineRunStatus.FAILED
    ) {
      run.completedAt = new Date();
      run.durationMs =
        run.completedAt.getTime() - run.startedAt.getTime();
    }

    return this.pipelineRunRepository.save(run);
  }

  generateSQL(dag: { nodes: any[]; edges: any[] }): string {
    // Simple SQL generation from DAG
    // This would be more complex in a real implementation
    let sql = '';

    for (const node of dag.nodes) {
      if (node.type === 'source') {
        sql += `SELECT * FROM ${node.data.table};\n`;
      } else if (node.type === 'transform') {
        sql += `${node.data.sql}\n`;
      } else if (node.type === 'sink') {
        sql += `INSERT INTO ${node.data.table} ...;\n`;
      }
    }

    return sql;
  }
}
