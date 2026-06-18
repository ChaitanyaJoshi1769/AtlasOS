import { Injectable } from '@nestjs/common';
import { KnowledgeGraphService } from './knowledge-graph.service';

@Injectable()
export class SemanticSearchService {
  constructor(private kgService: KnowledgeGraphService) {}

  /**
   * Perform semantic search across the knowledge graph
   */
  async search(query: string, limit: number = 20): Promise<any[]> {
    // This would typically use embeddings and vector search
    // For now, using text-based search with relationship ranking

    const entities = await this.kgService.searchEntities(query);
    const glossaryTerms = await this.kgService.searchGlossary(query);

    // Combine and rank results
    const results = [
      ...entities.map((e) => ({
        id: e.id,
        name: e.name,
        type: 'entity',
        entityType: e.type,
        description: e.description,
        score: this.calculateRelevanceScore(query, e.name),
      })),
      ...glossaryTerms.map((g) => ({
        id: g.id,
        name: g.term,
        type: 'glossary_term',
        definition: g.definition,
        score: this.calculateRelevanceScore(query, g.term),
      })),
    ];

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Search related entities by traversing relationships
   */
  async findRelated(entityId: string, depth: number = 2): Promise<any> {
    const entity = await this.kgService.findEntity(entityId);
    const relationships = await this.kgService.getRelationships(entityId);

    return {
      entity: {
        id: entity.id,
        name: entity.name,
        type: entity.type,
      },
      related: {
        upstream: relationships.incoming.map((rel) => ({
          entity: {
            id: rel.sourceEntity.id,
            name: rel.sourceEntity.name,
            type: rel.sourceEntity.type,
          },
          relationship: {
            type: rel.type,
            strength: rel.strength,
          },
        })),
        downstream: relationships.outgoing.map((rel) => ({
          entity: {
            id: rel.targetEntity.id,
            name: rel.targetEntity.name,
            type: rel.targetEntity.type,
          },
          relationship: {
            type: rel.type,
            strength: rel.strength,
          },
        })),
      },
    };
  }

  /**
   * Find impact of changes to an entity
   */
  async analyzeImpact(entityId: string): Promise<any> {
    const lineage = await this.kgService.getLineage(entityId, 5);

    return {
      entityId,
      affectedEntities: this.flattenLineage(lineage),
      impactDepth: this.calculateImpactDepth(lineage),
      estimatedAffectedUsers: this.estimateAffectedUsers(lineage),
    };
  }

  private flattenLineage(node: any, result: any[] = []): any[] {
    result.push({
      id: node.id,
      name: node.name,
      type: node.type,
    });

    if (node.dependencies && Array.isArray(node.dependencies)) {
      node.dependencies.forEach((dep) => this.flattenLineage(dep, result));
    }

    return result;
  }

  private calculateImpactDepth(node: any): number {
    if (!node.dependencies || node.dependencies.length === 0) {
      return 1;
    }

    return (
      1 + Math.max(...node.dependencies.map((dep) => this.calculateImpactDepth(dep)))
    );
  }

  private estimateAffectedUsers(lineage: any): number {
    // Simplified estimation based on lineage depth
    const depth = this.calculateImpactDepth(lineage);
    return depth * 10; // Placeholder logic
  }

  private calculateRelevanceScore(query: string, text: string): number {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    // Exact match
    if (textLower === queryLower) {
      return 1.0;
    }

    // Starts with
    if (textLower.startsWith(queryLower)) {
      return 0.8;
    }

    // Contains
    if (textLower.includes(queryLower)) {
      return 0.6;
    }

    // Levenshtein distance based
    const similarity = this.stringSimilarity(queryLower, textLower);
    return similarity * 0.4;
  }

  private stringSimilarity(s1: string, s2: string): number {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }

    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longerLength - editDistance) / longerLength;
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) {
        costs[s2.length] = lastValue;
      }
    }
    return costs[s2.length];
  }
}
