import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KGEntity } from './entities/entity.entity';
import { Relationship } from './entities/relationship.entity';
import { GlossaryTerm } from './entities/glossary.entity';
import { KnowledgeGraphService } from './services/knowledge-graph.service';
import { SemanticSearchService } from './services/semantic-search.service';
import { KnowledgeGraphController } from './controllers/knowledge-graph.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([KGEntity, Relationship, GlossaryTerm]),
  ],
  controllers: [KnowledgeGraphController],
  providers: [KnowledgeGraphService, SemanticSearchService],
  exports: [KnowledgeGraphService, SemanticSearchService],
})
export class KnowledgeGraphModule {}
