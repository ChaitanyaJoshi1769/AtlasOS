import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngestionRun, IngestionStatus } from '../entities/ingestion-run.entity';
import { Connector } from '../entities/connector.entity';
import { SchemaInferenceService } from './schema-inference.service';
import { PiiDetectionService } from './pii-detection.service';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(IngestionRun)
    private ingestionRunRepository: Repository<IngestionRun>,
    private schemaInferenceService: SchemaInferenceService,
    private piiDetectionService: PiiDetectionService,
  ) {}

  async createIngestionRun(connector: Connector): Promise<IngestionRun> {
    const run = this.ingestionRunRepository.create({
      connector,
      status: IngestionStatus.PENDING,
      durationMs: 0,
    });
    return this.ingestionRunRepository.save(run);
  }

  async startIngestion(connectorId: string, data: Record<string, any>[]): Promise<{
    schema: any;
    piiDetection: any[];
    recordCount: number;
  }> {
    // Infer schema from data
    const inferredSchema = this.schemaInferenceService.inferSchema(data);

    // Detect PII in columns
    const piiResults = [];
    for (const column of inferredSchema.columns) {
      const pii = this.piiDetectionService.detectPii(data, column.name);
      if (pii) {
        piiResults.push(pii);
      }
    }

    return {
      schema: inferredSchema,
      piiDetection: piiResults,
      recordCount: data.length,
    };
  }

  async getIngestionRuns(connectorId: string): Promise<IngestionRun[]> {
    return this.ingestionRunRepository.find({
      where: { connector: { id: connectorId } },
      order: { startedAt: 'DESC' },
    });
  }

  async updateRunStatus(
    runId: string,
    status: IngestionStatus,
    recordsProcessed: number = 0,
  ): Promise<IngestionRun> {
    const run = await this.ingestionRunRepository.findOne({ where: { id: runId } });
    if (!run) {
      throw new Error(`Ingestion run ${runId} not found`);
    }

    run.status = status;
    run.recordsProcessed = recordsProcessed;

    if (status === IngestionStatus.SUCCESS || status === IngestionStatus.FAILED) {
      run.completedAt = new Date();
      run.durationMs = run.completedAt.getTime() - run.startedAt.getTime();
    }

    return this.ingestionRunRepository.save(run);
  }
}
