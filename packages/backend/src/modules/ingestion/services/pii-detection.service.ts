import { Injectable } from '@nestjs/common';

export interface PiiDetectionResult {
  columnName: string;
  piiType: PiiType;
  confidence: number;
  samples?: any[];
}

export enum PiiType {
  EMAIL = 'email',
  PHONE = 'phone',
  SSN = 'ssn',
  CREDIT_CARD = 'credit_card',
  IP_ADDRESS = 'ip_address',
  NAME = 'name',
  ADDRESS = 'address',
  NONE = 'none',
}

@Injectable()
export class PiiDetectionService {
  /**
   * Detect PII in a dataset
   */
  detectPii(records: Record<string, any>[], columnName: string): PiiDetectionResult | null {
    if (!records || records.length === 0) {
      return null;
    }

    const samples = records
      .map((r) => r[columnName])
      .filter((v) => v !== null && v !== undefined)
      .slice(0, 100);

    if (samples.length === 0) {
      return null;
    }

    const piiType = this.detectPiiType(samples, columnName);

    if (piiType !== PiiType.NONE) {
      const confidence = this.calculateConfidence(samples, piiType);
      return {
        columnName,
        piiType,
        confidence,
        samples: samples.slice(0, 3),
      };
    }

    return null;
  }

  /**
   * Detect PII type from samples
   */
  private detectPiiType(samples: any[], columnName: string): PiiType {
    const stringsamples = samples
      .map((s) => String(s))
      .filter((s) => s && s.length > 0);

    if (stringsamples.length === 0) {
      return PiiType.NONE;
    }

    // Check column name hints
    const lowerColumnName = columnName.toLowerCase();
    if (lowerColumnName.includes('email')) {
      if (this.looksLikeEmail(stringsamples)) {
        return PiiType.EMAIL;
      }
    }
    if (lowerColumnName.includes('phone')) {
      if (this.looksLikePhone(stringsamples)) {
        return PiiType.PHONE;
      }
    }
    if (lowerColumnName.includes('ssn')) {
      if (this.looksLikeSsn(stringsamples)) {
        return PiiType.SSN;
      }
    }

    // Check actual content
    if (this.looksLikeEmail(stringsamples)) {
      return PiiType.EMAIL;
    }
    if (this.looksLikePhone(stringsamples)) {
      return PiiType.PHONE;
    }
    if (this.looksLikeSsn(stringsamples)) {
      return PiiType.SSN;
    }
    if (this.looksLikeCreditCard(stringsamples)) {
      return PiiType.CREDIT_CARD;
    }
    if (this.looksLikeIpAddress(stringsamples)) {
      return PiiType.IP_ADDRESS;
    }

    return PiiType.NONE;
  }

  private looksLikeEmail(samples: string[]): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailCount = samples.filter((s) => emailRegex.test(s)).length;
    return emailCount / samples.length > 0.8;
  }

  private looksLikePhone(samples: string[]): boolean {
    const phoneRegex = /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const phoneCount = samples.filter((s) => phoneRegex.test(s)).length;
    return phoneCount / samples.length > 0.8;
  }

  private looksLikeSsn(samples: string[]): boolean {
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    const ssnCount = samples.filter((s) => ssnRegex.test(s)).length;
    return ssnCount / samples.length > 0.8;
  }

  private looksLikeCreditCard(samples: string[]): boolean {
    const creditCardRegex = /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/;
    const creditCardCount = samples.filter((s) => creditCardRegex.test(s)).length;
    return creditCardCount / samples.length > 0.8;
  }

  private looksLikeIpAddress(samples: string[]): boolean {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipCount = samples.filter((s) => ipRegex.test(s)).length;
    return ipCount / samples.length > 0.8;
  }

  private calculateConfidence(samples: any[], piiType: PiiType): number {
    const stringsamples = samples
      .map((s) => String(s))
      .filter((s) => s && s.length > 0);

    let matchCount = 0;
    const regex = this.getRegexForType(piiType);

    if (!regex) {
      return 0;
    }

    for (const sample of stringsamples) {
      if (regex.test(sample)) {
        matchCount++;
      }
    }

    return matchCount / stringsamples.length;
  }

  private getRegexForType(piiType: PiiType): RegExp | null {
    switch (piiType) {
      case PiiType.EMAIL:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      case PiiType.PHONE:
        return /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
      case PiiType.SSN:
        return /^\d{3}-\d{2}-\d{4}$/;
      case PiiType.CREDIT_CARD:
        return /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/;
      case PiiType.IP_ADDRESS:
        return /^(\d{1,3}\.){3}\d{1,3}$/;
      default:
        return null;
    }
  }
}
