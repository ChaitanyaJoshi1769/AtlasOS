import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dataset } from '../entities/dataset.entity';
import { DatasetColumn } from '../entities/dataset-column.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    @InjectRepository(DatasetColumn)
    private datasetColumnRepository: Repository<DatasetColumn>,
  ) {}

  async createDataset(
    name: string,
    connectorId: string,
    sourceTable: string,
    schema: Record<string, any>,
  ): Promise<Dataset> {
    const dataset = this.datasetRepository.create({
      name,
      connector: { id: connectorId },
      sourceTable,
      schema,
    });

    const saved = await this.datasetRepository.save(dataset);

    // Create column entries
    if (schema.columns) {
      for (const column of schema.columns) {
        const datasetColumn = this.datasetColumnRepository.create({
          name: column.name,
          dataType: column.type,
          isNullable: column.nullable,
          uniqueValues: column.uniqueValues,
          dataset: saved,
        });
        await this.datasetColumnRepository.save(datasetColumn);
      }
    }

    return saved;
  }

  async findAll(): Promise<Dataset[]> {
    return this.datasetRepository.find({
      relations: ['connector', 'columns'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Dataset> {
    const dataset = await this.datasetRepository.findOne({
      where: { id },
      relations: ['connector', 'columns'],
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    return dataset;
  }

  async searchByName(name: string): Promise<Dataset[]> {
    return this.datasetRepository
      .createQueryBuilder('dataset')
      .where('dataset.name ILIKE :name', { name: `%${name}%` })
      .orWhere('dataset.description ILIKE :name', { name: `%${name}%` })
      .relations(['connector', 'columns'])
      .orderBy('dataset.createdAt', 'DESC')
      .getMany();
  }

  async getColumnInfo(datasetId: string): Promise<DatasetColumn[]> {
    return this.datasetColumnRepository.find({
      where: { dataset: { id: datasetId } },
    });
  }

  async updateDatasetStatistics(
    id: string,
    statistics: Record<string, any>,
  ): Promise<Dataset> {
    const dataset = await this.findOne(id);
    dataset.statistics = statistics;
    dataset.lastAnalyzedAt = new Date();
    return this.datasetRepository.save(dataset);
  }

  async tagDataset(id: string, tags: string[]): Promise<Dataset> {
    const dataset = await this.findOne(id);
    dataset.metadata = dataset.metadata || {};
    dataset.metadata.tags = tags;
    return this.datasetRepository.save(dataset);
  }
}
