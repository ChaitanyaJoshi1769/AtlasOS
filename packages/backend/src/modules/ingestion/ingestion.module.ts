import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Connector } from './entities/connector.entity';
import { IngestionRun } from './entities/ingestion-run.entity';
import { ConnectorService } from './services/connector.service';
import { ConnectorController } from './controllers/connector.controller';
import { IngestionService } from './services/ingestion.service';
import { SchemaInferenceService } from './services/schema-inference.service';
import { PiiDetectionService } from './services/pii-detection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Connector, IngestionRun]),
    BullModule.registerQueue({
      name: 'ingestion',
    }),
  ],
  controllers: [ConnectorController],
  providers: [
    ConnectorService,
    IngestionService,
    SchemaInferenceService,
    PiiDetectionService,
  ],
  exports: [ConnectorService, IngestionService],
})
export class IngestionModule {}
