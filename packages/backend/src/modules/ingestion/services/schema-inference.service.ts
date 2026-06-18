import { Injectable } from '@nestjs/common';

export interface InferredColumn {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json';
  nullable: boolean;
  uniqueValues?: number;
  sampleValues?: any[];
}

export interface InferredSchema {
  columns: InferredColumn[];
  recordCount: number;
  inferenceConfidence: number;
}

@Injectable()
export class SchemaInferenceService {
  /**
   * Infer schema from a sample of data
   */
  inferSchema(records: Record<string, any>[], sampleSize: number = 100): InferredSchema {
    if (!records || records.length === 0) {
      return {
        columns: [],
        recordCount: 0,
        inferenceConfidence: 0,
      };
    }

    const sample = records.slice(0, sampleSize);
    const columns = new Map<string, InferredColumn>();

    // First pass: identify all columns
    sample.forEach((record) => {
      Object.keys(record).forEach((key) => {
        if (!columns.has(key)) {
          columns.set(key, {
            name: key,
            type: 'string',
            nullable: false,
            sampleValues: [],
          });
        }
      });
    });

    // Second pass: infer types and collect statistics
    sample.forEach((record) => {
      columns.forEach((column, key) => {
        const value = record[key];

        if (value === null || value === undefined) {
          column.nullable = true;
        } else {
          const inferredType = this.inferType(value);
          if (column.type === 'string' || inferredType === column.type) {
            column.type = inferredType;
          }
          // Keep sample values for analysis
          if (!column.sampleValues) {
            column.sampleValues = [];
          }
          if (column.sampleValues.length < 5) {
            column.sampleValues.push(value);
          }
        }
      });
    });

    // Calculate unique values and confidence
    const columnArray = Array.from(columns.values());
    columnArray.forEach((column) => {
      const uniqueValues = new Set(
        sample
          .map((r) => r[column.name])
          .filter((v) => v !== null && v !== undefined),
      );
      column.uniqueValues = uniqueValues.size;
    });

    return {
      columns: columnArray,
      recordCount: records.length,
      inferenceConfidence: 0.95, // High confidence for sampled data
    };
  }

  /**
   * Infer the type of a value
   */
  private inferType(value: any): InferredColumn['type'] {
    if (value === null || value === undefined) {
      return 'string';
    }

    if (typeof value === 'boolean') {
      return 'boolean';
    }

    if (typeof value === 'number') {
      return 'number';
    }

    if (value instanceof Date) {
      return 'date';
    }

    if (typeof value === 'object') {
      return 'json';
    }

    if (typeof value === 'string') {
      // Try to detect if it's a date
      if (this.isDate(value)) {
        return 'date';
      }
      // Try to detect if it's a number
      if (this.isNumber(value)) {
        return 'number';
      }
      // Try to detect if it's a boolean
      if (this.isBoolean(value)) {
        return 'boolean';
      }
    }

    return 'string';
  }

  private isDate(value: string): boolean {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
      /^\d{4}\/\d{2}\/\d{2}/, // YYYY/MM/DD
    ];
    return datePatterns.some((pattern) => pattern.test(value));
  }

  private isNumber(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }

  private isBoolean(value: string): boolean {
    return ['true', 'false', 'yes', 'no', '1', '0'].includes(
      value.toLowerCase(),
    );
  }
}
