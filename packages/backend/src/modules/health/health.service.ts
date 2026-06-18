import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '0.1.0',
    };
  }

  ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
