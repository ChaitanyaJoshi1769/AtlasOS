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
import { KnowledgeGraphService } from '../services/knowledge-graph.service';
import { SemanticSearchService } from '../services/semantic-search.service';
import { EntityType } from '../entities/entity.entity';
import { RelationType } from '../entities/relationship.entity';

@Controller('api/knowledge-graph')
export class KnowledgeGraphController {
  constructor(
    private kgService: KnowledgeGraphService,
    private semanticSearchService: SemanticSearchService,
  ) {}

  // Entities
  @Post('entities')
  @HttpCode(HttpStatus.CREATED)
  async createEntity(@Body() createEntityDto: any) {
    return this.kgService.createEntity(
      createEntityDto.name,
      createEntityDto.type,
      createEntityDto.description,
      createEntityDto.definition,
    );
  }

  @Get('entities/:id')
  async getEntity(@Param('id') id: string) {
    return this.kgService.findEntity(id);
  }

  @Get('entities/type/:type')
  async getEntitiesByType(@Param('type') type: EntityType) {
    return this.kgService.findByType(type);
  }

  @Get('search/entities')
  async searchEntities(@Query('q') query: string) {
    return this.kgService.searchEntities(query);
  }

  // Relationships
  @Post('relationships')
  @HttpCode(HttpStatus.CREATED)
  async createRelationship(@Body() createRelDto: any) {
    return this.kgService.createRelationship(
      createRelDto.sourceId,
      createRelDto.targetId,
      createRelDto.type,
      createRelDto.description,
      createRelDto.strength,
    );
  }

  @Get('entities/:id/relationships')
  async getRelationships(@Param('id') id: string) {
    return this.kgService.getRelationships(id);
  }

  // Lineage
  @Get('entities/:id/lineage')
  async getLineage(@Param('id') id: string, @Query('depth') depth?: number) {
    return this.kgService.getLineage(id, depth || 3);
  }

  // Semantic Search
  @Get('search')
  async semanticSearch(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.semanticSearchService.search(query, limit || 20);
  }

  @Get('entities/:id/related')
  async findRelated(@Param('id') id: string) {
    return this.semanticSearchService.findRelated(id);
  }

  @Get('entities/:id/impact')
  async analyzeImpact(@Param('id') id: string) {
    return this.semanticSearchService.analyzeImpact(id);
  }

  // Glossary
  @Post('glossary')
  @HttpCode(HttpStatus.CREATED)
  async createGlossaryTerm(@Body() createTermDto: any) {
    return this.kgService.createGlossaryTerm(
      createTermDto.term,
      createTermDto.definition,
      createTermDto.businessOwner,
      createTermDto.category,
    );
  }

  @Get('glossary/:id')
  async getGlossaryTerm(@Param('id') id: string) {
    return this.kgService.findGlossaryTerm(id);
  }

  @Get('glossary/search')
  async searchGlossary(@Query('q') query: string) {
    return this.kgService.searchGlossary(query);
  }

  @Get('glossary')
  async getGlossary(@Query('category') category?: string) {
    return this.kgService.getGlossary(category);
  }

  // Statistics
  @Get('statistics')
  async getStatistics() {
    return this.kgService.getGraphStatistics();
  }
}
