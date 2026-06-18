import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConnectorService } from '../services/connector.service';
import { CreateConnectorDto, UpdateConnectorDto, TestConnectorDto } from '../dtos/connector.dto';

@Controller('api/connectors')
export class ConnectorController {
  constructor(private readonly connectorService: ConnectorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createConnectorDto: CreateConnectorDto) {
    return this.connectorService.create(createConnectorDto);
  }

  @Get()
  findAll() {
    return this.connectorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.connectorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConnectorDto: UpdateConnectorDto,
  ) {
    return this.connectorService.update(id, updateConnectorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.connectorService.remove(id);
  }

  @Post(':id/test')
  async testConnection(@Param('id') id: string) {
    return this.connectorService.testConnection(id);
  }

  @Post(':id/sync')
  @HttpCode(HttpStatus.ACCEPTED)
  async sync(@Param('id') id: string) {
    const connector = await this.connectorService.findOne(id);
    // Trigger async ingestion job
    return {
      message: 'Ingestion started',
      connectorId: id,
    };
  }
}
