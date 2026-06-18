export interface IRequestUser {
  id: string;
  email: string;
  role: string;
  workspaceId: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface IQueryOptions {
  skip?: number;
  take?: number;
  order?: Record<string, 'ASC' | 'DESC'>;
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum DataSourceType {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  MONGODB = 'mongodb',
  S3 = 's3',
  CSV = 'csv',
  PARQUET = 'parquet',
  KAFKA = 'kafka',
  REST_API = 'rest_api',
  WEBHOOK = 'webhook',
}

export enum ConnectorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  TESTING = 'testing',
}

export enum PipelineStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
