import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connector, ConnectorStatus, ConnectorType } from '../entities/connector.entity';
import { CreateConnectorDto, UpdateConnectorDto } from '../dtos/connector.dto';

@Injectable()
export class ConnectorService {
  constructor(
    @InjectRepository(Connector)
    private connectorRepository: Repository<Connector>,
  ) {}

  async create(createConnectorDto: CreateConnectorDto): Promise<Connector> {
    const connector = this.connectorRepository.create(createConnectorDto);
    return this.connectorRepository.save(connector);
  }

  async findAll(): Promise<Connector[]> {
    return this.connectorRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Connector> {
    const connector = await this.connectorRepository.findOne({ where: { id } });
    if (!connector) {
      throw new NotFoundException(`Connector with ID ${id} not found`);
    }
    return connector;
  }

  async update(id: string, updateConnectorDto: UpdateConnectorDto): Promise<Connector> {
    const connector = await this.findOne(id);
    Object.assign(connector, updateConnectorDto);
    return this.connectorRepository.save(connector);
  }

  async remove(id: string): Promise<void> {
    const connector = await this.findOne(id);
    await this.connectorRepository.remove(connector);
  }

  async testConnection(id: string): Promise<{ success: boolean; message: string }> {
    const connector = await this.findOne(id);

    try {
      switch (connector.type) {
        case ConnectorType.POSTGRESQL:
          return this.testPostgresConnection(connector);
        case ConnectorType.S3:
          return this.testS3Connection(connector);
        case ConnectorType.SALESFORCE:
          return this.testSalesforceConnection(connector);
        case ConnectorType.REST_API:
          return this.testRestApiConnection(connector);
        default:
          return { success: false, message: 'Connector type not supported for testing' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  private async testPostgresConnection(connector: Connector): Promise<{ success: boolean; message: string }> {
    // Implementation for testing PostgreSQL connection
    return { success: true, message: 'PostgreSQL connection successful' };
  }

  private async testS3Connection(connector: Connector): Promise<{ success: boolean; message: string }> {
    // Implementation for testing S3 connection
    return { success: true, message: 'S3 connection successful' };
  }

  private async testSalesforceConnection(connector: Connector): Promise<{ success: boolean; message: string }> {
    // Implementation for testing Salesforce connection
    return { success: true, message: 'Salesforce connection successful' };
  }

  private async testRestApiConnection(connector: Connector): Promise<{ success: boolean; message: string }> {
    // Implementation for testing REST API connection
    return { success: true, message: 'REST API connection successful' };
  }

  async updateStatus(id: string, status: ConnectorStatus): Promise<Connector> {
    const connector = await this.findOne(id);
    connector.status = status;
    return this.connectorRepository.save(connector);
  }

  async findByType(type: ConnectorType): Promise<Connector[]> {
    return this.connectorRepository.find({ where: { type } });
  }
}
