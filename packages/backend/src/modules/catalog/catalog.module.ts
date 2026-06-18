import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dataset } from './entities/dataset.entity';
import { DatasetColumn } from './entities/dataset-column.entity';
import { CatalogService } from './services/catalog.service';
import { CatalogController } from './controllers/catalog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dataset, DatasetColumn])],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
