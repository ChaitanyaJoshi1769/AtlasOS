import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CatalogService } from '../services/catalog.service';

@Controller('api/catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async getAllDatasets() {
    return this.catalogService.findAll();
  }

  @Get('search')
  async searchDatasets(@Query('q') query: string) {
    return this.catalogService.searchByName(query);
  }

  @Get(':id')
  async getDataset(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }

  @Get(':id/columns')
  async getDatasetColumns(@Param('id') id: string) {
    return this.catalogService.getColumnInfo(id);
  }

  @Post(':id/statistics')
  @HttpCode(HttpStatus.OK)
  async updateStatistics(
    @Param('id') id: string,
    @Body() statistics: Record<string, any>,
  ) {
    return this.catalogService.updateDatasetStatistics(id, statistics);
  }

  @Post(':id/tags')
  @HttpCode(HttpStatus.OK)
  async tagDataset(@Param('id') id: string, @Body('tags') tags: string[]) {
    return this.catalogService.tagDataset(id, tags);
  }
}
