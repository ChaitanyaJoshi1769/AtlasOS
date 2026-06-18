-- Create TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS ingestion;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS transformation;
CREATE SCHEMA IF NOT EXISTS agents;

-- Ingestion schema tables
CREATE TABLE IF NOT EXISTS ingestion.connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catalog schema tables
CREATE TABLE IF NOT EXISTS catalog.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  connector_id UUID REFERENCES ingestion.connectors(id),
  schema JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transformation schema tables
CREATE TABLE IF NOT EXISTS transformation.pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  dag JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hypertable for pipeline runs (time-series)
CREATE TABLE IF NOT EXISTS transformation.pipeline_runs (
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pipeline_id UUID NOT NULL,
  status VARCHAR(50) NOT NULL,
  duration_ms INTEGER,
  error_message TEXT
);

SELECT create_hypertable('transformation.pipeline_runs', 'time', if_not_exists => TRUE);

-- Agents schema tables
CREATE TABLE IF NOT EXISTS agents.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  agent_type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hypertable for agent runs (time-series)
CREATE TABLE IF NOT EXISTS agents.agent_runs (
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  agent_id UUID NOT NULL,
  task_id UUID,
  status VARCHAR(50) NOT NULL,
  result JSONB,
  error_message TEXT
);

SELECT create_hypertable('agents.agent_runs', 'time', if_not_exists => TRUE);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_connectors_type ON ingestion.connectors(type);
CREATE INDEX IF NOT EXISTS idx_connectors_status ON ingestion.connectors(status);
CREATE INDEX IF NOT EXISTS idx_datasets_connector_id ON catalog.datasets(connector_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_status ON transformation.pipelines(status);
CREATE INDEX IF NOT EXISTS idx_agents_type ON agents.agents(agent_type);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents.agents(status);

-- Create test data
INSERT INTO ingestion.connectors (name, type, config, status)
VALUES
  ('PostgreSQL Demo', 'postgresql', '{"host": "localhost", "port": 5432}', 'active'),
  ('S3 Demo', 's3', '{"endpoint": "http://minio:9000", "bucket": "atlas-data"}', 'active')
ON CONFLICT DO NOTHING;
