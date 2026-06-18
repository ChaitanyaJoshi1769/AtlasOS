import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pipeline } from './entities/pipeline.entity';
import { PipelineRun } from './entities/pipeline-run.entity';
import { TransformationService } from './services/transformation.service';
import { TransformationController } from './controllers/transformation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pipeline, PipelineRun])],
  controllers: [TransformationController],
  providers: [TransformationService],
  exports: [TransformationService],
})
export class TransformationModule {}
