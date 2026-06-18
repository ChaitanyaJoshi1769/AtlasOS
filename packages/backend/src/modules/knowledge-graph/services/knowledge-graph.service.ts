import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KGEntity, EntityType } from '../entities/entity.entity';
import { Relationship, RelationType } from '../entities/relationship.entity';
import { GlossaryTerm } from '../entities/glossary.entity';

@Injectable()
export class KnowledgeGraphService {
  constructor(
    @InjectRepository(KGEntity)
    private entityRepository: Repository<KGEntity>,
    @InjectRepository(Relationship)
    private relationshipRepository: Repository<Relationship>,
    @InjectRepository(GlossaryTerm)
    private glossaryRepository: Repository<GlossaryTerm>,
  ) {}

  // Entity Management
  async createEntity(
    name: string,
    type: EntityType,
    description?: string,
    definition?: string,
  ): Promise<KGEntity> {
    const entity = this.entityRepository.create({
      name,
      type,
      description,
      definition,
    });
    return this.entityRepository.save(entity);
  }

  async findEntity(id: string): Promise<KGEntity> {
    const entity = await this.entityRepository.findOne({
      where: { id },
      relations: ['outgoingRelationships', 'incomingRelationships'],
    });

    if (!entity) {
      throw new NotFoundException(`Entity ${id} not found`);
    }

    return entity;
  }

  async searchEntities(query: string): Promise<KGEntity[]> {
    return this.entityRepository
      .createQueryBuilder('entity')
      .where('entity.name ILIKE :query', { query: `%${query}%` })
      .orWhere('entity.description ILIKE :query', { query: `%${query}%` })
      .orWhere('entity.definition ILIKE :query', { query: `%${query}%` })
      .orderBy('entity.usageCount', 'DESC')
      .getMany();
  }

  async findByType(type: EntityType): Promise<KGEntity[]> {
    return this.entityRepository.find({ where: { type } });
  }

  // Relationship Management
  async createRelationship(
    sourceId: string,
    targetId: string,
    type: RelationType,
    description?: string,
    strength: number = 1.0,
  ): Promise<Relationship> {
    const sourceEntity = await this.findEntity(sourceId);
    const targetEntity = await this.findEntity(targetId);

    const relationship = this.relationshipRepository.create({
      sourceEntity,
      targetEntity,
      type,
      description,
      strength,
    });

    return this.relationshipRepository.save(relationship);
  }

  async getRelationships(entityId: string): Promise<{
    outgoing: Relationship[];
    incoming: Relationship[];
  }> {
    const outgoing = await this.relationshipRepository.find({
      where: { sourceEntity: { id: entityId } },
      relations: ['targetEntity'],
    });

    const incoming = await this.relationshipRepository.find({
      where: { targetEntity: { id: entityId } },
      relations: ['sourceEntity'],
    });

    return { outgoing, incoming };
  }

  // Lineage Tracking
  async getLineage(entityId: string, depth: number = 3): Promise<any> {
    const entity = await this.findEntity(entityId);
    const visited = new Set<string>();
    const lineage = await this.traceLineage(entity, depth, visited);
    return lineage;
  }

  private async traceLineage(
    entity: KGEntity,
    depth: number,
    visited: Set<string>,
  ): Promise<any> {
    if (depth === 0 || visited.has(entity.id)) {
      return {
        id: entity.id,
        name: entity.name,
        type: entity.type,
      };
    }

    visited.add(entity.id);

    const dependencies = await this.relationshipRepository.find({
      where: { sourceEntity: { id: entity.id } },
      relations: ['targetEntity'],
    });

    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      dependencies: await Promise.all(
        dependencies.map((dep) =>
          this.traceLineage(dep.targetEntity, depth - 1, visited),
        ),
      ),
    };
  }

  // Glossary Management
  async createGlossaryTerm(
    term: string,
    definition: string,
    businessOwner?: string,
    category?: string,
  ): Promise<GlossaryTerm> {
    const glossaryTerm = this.glossaryRepository.create({
      term,
      definition,
      businessOwner,
      category,
    });
    return this.glossaryRepository.save(glossaryTerm);
  }

  async findGlossaryTerm(id: string): Promise<GlossaryTerm> {
    const term = await this.glossaryRepository.findOne({ where: { id } });
    if (!term) {
      throw new NotFoundException(`Glossary term ${id} not found`);
    }
    return term;
  }

  async searchGlossary(query: string): Promise<GlossaryTerm[]> {
    return this.glossaryRepository
      .createQueryBuilder('term')
      .where('term.term ILIKE :query', { query: `%${query}%` })
      .orWhere('term.definition ILIKE :query', { query: `%${query}%` })
      .orderBy('term.usageCount', 'DESC')
      .getMany();
  }

  async getGlossary(category?: string): Promise<GlossaryTerm[]> {
    if (category) {
      return this.glossaryRepository.find({
        where: { category },
        order: { term: 'ASC' },
      });
    }
    return this.glossaryRepository.find({
      order: { term: 'ASC' },
    });
  }

  // Graph Statistics
  async getGraphStatistics(): Promise<any> {
    const entityCount = await this.entityRepository.count();
    const relationshipCount = await this.relationshipRepository.count();
    const glossaryCount = await this.glossaryRepository.count();

    const entityTypes = await this.entityRepository
      .createQueryBuilder('entity')
      .select('entity.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('entity.type')
      .getRawMany();

    const relationshipTypes = await this.relationshipRepository
      .createQueryBuilder('rel')
      .select('rel.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('rel.type')
      .getRawMany();

    return {
      entities: entityCount,
      relationships: relationshipCount,
      glossaryTerms: glossaryCount,
      entityTypes,
      relationshipTypes,
    };
  }
}
