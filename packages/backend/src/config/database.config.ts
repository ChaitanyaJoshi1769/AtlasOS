import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'atlas',
  password: process.env.DATABASE_PASSWORD || 'password',
  name: process.env.DATABASE_NAME || 'atlas',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true',
}));

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  db: parseInt(process.env.REDIS_DB || '0', 10),
  url: process.env.REDIS_URL,
};

export const s3Config = {
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
  bucket: process.env.S3_BUCKET || 'atlas-data',
  region: process.env.S3_REGION || 'us-east-1',
};
