# AtlasOS

> **AI-native data operating system for autonomous agents**

AtlasOS is an enterprise-grade platform designed from first principles for autonomous AI agents. Instead of dashboards for humans, AtlasOS provides APIs and memory systems for agents to autonomously ingest, understand, transform, and serve enterprise data.

Think: **Snowflake + Databricks + dbt + Airbyte + LangGraph + Temporal + Model Context Protocol**, all designed for agent-native workflows.

## Vision

Traditional data platforms optimize for human dashboards. AtlasOS optimizes for agent autonomy:

- **Agents ingest** any enterprise data
- **Agents understand** schema, semantics, and lineage automatically
- **Agents transform** data through autonomous pipelines
- **Agents serve** other agents with knowledge and data
- **Agents reason** over business semantics and knowledge graphs
- **Agents govern** data quality, compliance, and policies
- **Humans supervise** agent decisions and set policies

## Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/ChaitanyaJoshi1769/AtlasOS.git
cd AtlasOS

# Install dependencies
npm install

# Start all services locally
docker-compose up

# Open dashboard
open http://localhost:3000
```

### With Docker Compose

```bash
docker-compose up --build

# Check services
docker-compose ps

# View logs
docker-compose logs -f backend
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              AtlasOS Platform                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐      ┌──────────────────────┐   │
│  │  Agent Runtime   │      │   Knowledge Graph    │   │
│  │  (Python/       │      │   (Neo4j)            │   │
│  │   LangGraph)    │      │                      │   │
│  └────────┬─────────┘      └──────────┬───────────┘   │
│           │                           │                │
│  ┌────────▼──────────────────────────▼──────┐         │
│  │    API Gateway & Services                │         │
│  │  (REST, GraphQL, gRPC)                   │         │
│  └────────┬──────────────────────────┬──────┘         │
│           │                          │                │
│  ┌────────▼─────────┐      ┌────────▼──────────┐    │
│  │ Data Ingestion   │      │ Transformation    │    │
│  │ • Connectors     │      │ • DuckDB SQL DAG  │    │
│  │ • Schema Inf.    │      │ • Spark (future)  │    │
│  │ • Staging        │      │ • dbt integration │    │
│  └────────┬─────────┘      └────────┬──────────┘    │
│           │                          │                │
│  ┌────────▼──────────────────────────▼──────┐        │
│  │    Storage Layer                         │        │
│  │  • PostgreSQL (metadata)                 │        │
│  │  • TimescaleDB (time-series)             │        │
│  │  • S3/MinIO (data lake)                  │        │
│  │  • Qdrant (vectors)                      │        │
│  └──────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

## Project Structure

```
packages/
├── backend/          # NestJS API services
├── ai-runtime/       # Python FastAPI + LangGraph
├── frontend/         # Next.js React application
├── infra/           # Docker, Kubernetes, Terraform
├── sdk-typescript/  # TypeScript client SDK
└── sdk-python/      # Python client SDK

docs/                # Architecture & guides
.github/workflows/   # CI/CD pipelines
```

## Key Features (Phase 1)

- ✅ Universal data ingestion (CSV, PostgreSQL, S3, REST APIs)
- ✅ Automatic schema inference with PII detection
- ✅ Semantic catalog and metadata management
- ✅ SQL-based transformation DAGs with DuckDB
- ✅ Agent framework with LangGraph orchestration
- ✅ Memory system (semantic + episodic)
- ✅ Data quality monitoring agents
- ✅ REST API + GraphQL endpoints
- ✅ Modern React dashboard
- ✅ Docker Compose for local dev
- ✅ Kubernetes + Helm deployment
- ✅ GitHub Actions CI/CD

## Roadmap

### Phase 1: MVP Foundation ✨ (Current)
End-to-end system with ingestion, transformation, agents, and UI.

### Phase 2: Enterprise Connectors
Salesforce, HubSpot, Jira, Confluence, GitHub, Notion, etc.

### Phase 3: Knowledge Graph + Semantic Search
Neo4j integration, entity/relationship extraction, business glossary, lineage visualization.

### Phase 4: Advanced Agents + Autonomy
Multi-agent orchestration, hierarchical delegation, self-healing, cost optimization.

### Phase 5: Governance + Enterprise Features
RBAC/ABAC, compliance frameworks (GDPR, HIPAA, SOC2), audit logging.

### Phase 6: Advanced Observability
OpenTelemetry, distributed tracing, cost analytics, performance dashboards.

## Technology Stack

### Backend
- **Framework**: NestJS 10 (TypeScript)
- **Database**: PostgreSQL 15 + TimescaleDB
- **Cache**: Redis 7
- **API**: REST (Express) + GraphQL (Apollo)
- **Queue**: Bull (Redis-backed)
- **ORM**: TypeORM

### AI Runtime
- **Framework**: FastAPI (Python)
- **Orchestration**: LangGraph
- **Agents**: PydanticAI compatible
- **Embeddings**: OpenAI + Anthropic APIs
- **Vector DB**: Qdrant
- **Memory**: Hybrid vector + semantic

### Frontend
- **Framework**: Next.js 16
- **UI**: React 19 + shadcn/ui
- **Styling**: TailwindCSS
- **State**: TanStack Query + Zustand
- **Visualization**: React Flow + Recharts

### Infrastructure
- **Container**: Docker + Docker Compose
- **Orchestration**: Kubernetes + Helm
- **IaC**: Terraform (AWS)
- **CI/CD**: GitHub Actions
- **Storage**: S3/MinIO, PostgreSQL, Qdrant

## Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

### Setup

```bash
# Install monorepo dependencies
npm install

# Setup environment
cp .env.example .env

# Start local services
docker-compose up

# Run development servers
npm run dev

# Run tests
npm run test

# Run type checking
npm run type-check
```

### Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build -- --filter=@atlas/backend

# Build Docker images
npm run docker:build
```

## Deployment

### Local Development
```bash
docker-compose up
```

### Kubernetes
```bash
helm install atlas ./packages/infra/helm/atlas
```

### AWS
```bash
cd packages/infra/terraform
terraform init
terraform apply
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed guides.

## API Documentation

- REST API: [OpenAPI Docs](http://localhost:3000/api)
- GraphQL: [GraphQL Playground](http://localhost:3000/graphql)

See [API.md](docs/API.md) for detailed API reference.

## Contributing

1. Read [CONTRIBUTING.md](docs/CONTRIBUTING.md)
2. Create a feature branch
3. Make changes and write tests
4. Submit PR with description
5. Ensure CI passes

## License

Apache License 2.0 - See LICENSE file

## Community

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and ideas
- **Email**: contact@atlas-os.dev

## Status

🚀 **Active Development** - Phase 1 MVP in progress

Last Updated: June 2026
