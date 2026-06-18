import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransformationService } from '../services/transformation.service';

@Controller('api/pipelines')
export class TransformationController {
  constructor(private readonly transformationService: TransformationService) {}

  @Get()
  async getAllPipelines() {
    return this.transformationService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPipeline(@Body() createPipelineDto: any) {
    const { name, description, dag } = createPipelineDto;
    return this.transformationService.createPipeline(name, description, dag);
  }

  @Get(':id')
  async getPipeline(@Param('id') id: string) {
    return this.transformationService.findOne(id);
  }

  @Patch(':id')
  async updatePipeline(@Param('id') id: string, @Body() updateDto: any) {
    return this.transformationService.updatePipeline(id, updateDto);
  }

  @Post(':id/validate')
  async validatePipeline(@Param('id') id: string) {
    const pipeline = await this.transformationService.findOne(id);
    return this.transformationService.validateDag(pipeline.dag);
  }

  @Post(':id/execute')
  @HttpCode(HttpStatus.ACCEPTED)
  async executePipeline(@Param('id') id: string) {
    return this.transformationService.executePipeline(id);
  }

  @Get(':id/runs')
  async getPipelineRuns(@Param('id') id: string) {
    return this.transformationService.getPipelineRuns(id);
  }

  @Post(':id/sql')
  async generateSQL(@Param('id') id: string) {
    const pipeline = await this.transformationService.findOne(id);
    const sql = this.transformationService.generateSQL(pipeline.dag);
    return { sql };
  }
}
