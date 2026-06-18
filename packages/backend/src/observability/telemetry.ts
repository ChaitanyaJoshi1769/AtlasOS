import { Logger } from '@nestjs/common';

/**
 * Telemetry and observability utilities
 */

export class TelemetryService {
  private logger = new Logger('Telemetry');

  /**
   * Track request metrics
   */
  trackRequestMetrics(method: string, path: string, durationMs: number, statusCode: number) {
    this.logger.log(`HTTP ${method} ${path} - ${statusCode} - ${durationMs}ms`);
    // Would send to Prometheus/OpenTelemetry in production
  }

  /**
   * Track database operation
   */
  trackDatabaseOperation(operation: string, table: string, durationMs: number, rowsAffected: number) {
    this.logger.debug(
      `DB ${operation} on ${table}: ${durationMs}ms, ${rowsAffected} rows`,
    );
  }

  /**
   * Track business event
   */
  trackBusinessEvent(eventType: string, data: Record<string, any>) {
    this.logger.log(`EVENT: ${eventType}`, data);
    // Would send to event stream in production
  }

  /**
   * Track error
   */
  trackError(error: Error, context: string) {
    this.logger.error(`ERROR in ${context}: ${error.message}`, error.stack);
  }

  /**
   * Get system metrics
   */
  getSystemMetrics() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    return {
      uptime,
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      cpu: process.cpuUsage(),
    };
  }
}
