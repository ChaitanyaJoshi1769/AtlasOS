import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction, AuditResource } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(
    userId: string,
    action: AuditAction,
    resource: AuditResource,
    resourceId: string,
    description?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    statusCode: number = 200,
    errorMessage?: string,
  ): Promise<AuditLog> {
    const log = this.auditRepository.create({
      userId,
      action,
      resource,
      resourceId,
      description,
      changes,
      ipAddress,
      statusCode,
      errorMessage,
    });

    return this.auditRepository.save(log);
  }

  async getLogs(
    userId?: string,
    resource?: AuditResource,
    action?: AuditAction,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    const query = this.auditRepository.createQueryBuilder('log');

    if (userId) {
      query.where('log.userId = :userId', { userId });
    }
    if (resource) {
      query.andWhere('log.resource = :resource', { resource });
    }
    if (action) {
      query.andWhere('log.action = :action', { action });
    }

    return query.orderBy('log.createdAt', 'DESC').take(limit).getMany();
  }

  async getComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const logs = await this.auditRepository
      .createQueryBuilder('log')
      .where('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return {
      period: {
        startDate,
        endDate,
      },
      totalActions: logs.length,
      actionsByType: this.groupBy(logs, 'action'),
      actionsByResource: this.groupBy(logs, 'resource'),
      errorCount: logs.filter((l) => l.statusCode >= 400).length,
      successRate: (
        (logs.filter((l) => l.statusCode < 400).length / logs.length) *
        100
      ).toFixed(2),
    };
  }

  private groupBy(
    items: any[],
    key: string,
  ): Record<string, number> {
    return items.reduce(
      (acc, item) => {
        acc[item[key]] = (acc[item[key]] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
