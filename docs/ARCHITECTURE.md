# AtlasOS Architecture

## Overview

AtlasOS is an AI-native data operating system with a microservices architecture designed for autonomous agents.

```
┌────────────────────────────────────────────────────────────────┐
│                      User Interface Layer                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend Dashboard (React 19 + TailwindCSS)    │  │
│  │  - Project Management  - Connector Setup                │  │
│  │  - Schema Explorer     - Pipeline Builder               │  │
│  │  - Agent Monitor       - Real-time Metrics              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐   │
│  │ REST API         │  │ GraphQL API      │  │ gRPC API   │   │
│  │ (Express)        │  │ (Apollo Server)  │  │ (Protocol) │   │
│  └──────────────────┘  └──────────────────┘  └────────────┘   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    Backend Services Layer (NestJS)             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐   │
│  │ Ingestion Module │  │ Catalog Module   │  │ Transform. │   │
│  │ - Connectors     │  │ - Schema Mgmt    │  │ - DAG Exec │   │
│  │ - Parsers        │  │ - Metadata       │  │ - DuckDB   │   │
│  │ - PII Detection  │  │ - Lineage        │  │ - Pipeline │   │
│  └──────────────────┘  └──────────────────┘  └────────────┘   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐   │
│  │ Auth Module      │  │ Health Module    │  │ Job Queue  │   │
│  │ - JWT/OIDC       │  │ - Liveness       │  │ - Bull     │   │
│  │ - Permissions    │  │ - Readiness      │  │ - Redis    │   │
│  └──────────────────┘  └──────────────────┘  └────────────┘   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                   AI Runtime Layer (Python/FastAPI)            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐   │
│  │ Agent Framework  │  │ Memory System    │  │ MCP Server │   │
│  │ - LangGraph      │  │ - Vector Mem.    │  │ - Catalog  │   │
│  │ - Tool Definition│  │ - Semantic Mem.  │  │ - Tools    │   │
│  │ - Orchestration  │  │ - Working Mem.   │  │ - Resources│   │
│  └──────────────────┘  └──────────────────┘  └────────────┘   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    Data Integration Layer                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Streaming: Kafka / RabbitMQ                              │  │
│  │ Jobs: Bull Queue + Redis                                 │  │
│  │ Events: Event-driven architecture                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    Storage & Data Layer                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐   │
│  │ Operational      │  │ Data Lake        │  │ Vector DB  │   │
│  │ PostgreSQL 15    │  │ MinIO / S3       │  │ Qdrant     │   │
│  │ + TimescaleDB    │  │ (Object Storage) │  │ (Embeddings)   │
│  └──────────────────┘  └──────────────────┘  └────────────┘   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐   │
│  │ Cache            │  │ Message Queue    │  │ (Future)   │   │
│  │ Redis 7          │  │ Kafka 3.x        │  │ Graph DB   │   │
│  │ (Caching)        │  │ (Streaming)      │  │ Neo4j      │   │
│  └──────────────────┘  └──────────────────┘  └────────────┘   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                  Infrastructure & DevOps Layer                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐   │
│  │ Container        │  │ Orchestration    │  │ IaC        │   │
│  │ Docker           │  │ Kubernetes       │  │ Terraform  │   │
│  │ Docker Compose   │  │ (Future)         │  │ Helm       │   │
│  └──────────────────┘  └──────────────────┘  └────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (Next.js 16)
- **Framework**: React 19 + Next.js 16
- **State**: TanStack Query (server) + Zustand (UI)
- **Styling**: TailwindCSS + shadcn/ui components
- **Visualization**: React Flow (DAGs), Recharts (metrics)
- **Deployment**: Docker, Vercel, self-hosted

### Backend (NestJS)
- **Framework**: NestJS 10 with TypeScript
- **Database**: TypeORM with PostgreSQL 15 + TimescaleDB
- **APIs**: REST (Express) + GraphQL (Apollo Server)
- **Auth**: JWT + OIDC ready
- **Queue**: Bull with Redis
- **Deployment**: Docker, Kubernetes

### AI Runtime (Python/FastAPI)
- **Framework**: FastAPI (async)
- **Agents**: LangGraph-based orchestration
- **LLMs**: OpenAI, Anthropic, Gemini compatible
- **Memory**: Hybrid (vector + semantic)
- **Vector DB**: Qdrant
- **MCP**: Model Context Protocol server
- **Deployment**: Docker, Kubernetes

## Data Flow

### Ingestion Pipeline
```
User → UI/API → Backend (Ingestion Module)
  ↓
Connector (PostgreSQL, S3, etc.)
  ↓
Parser (Detect format)
  ↓
Schema Inference (Automatic type detection)
  ↓
PII Detection (Privacy classification)
  ↓
Validation (Data quality)
  ↓
Staging (Temporary storage)
  ↓
Catalog Update (Metadata store)
  ↓
PostgreSQL + MinIO (Permanent storage)
```

### Transformation Pipeline
```
User → Pipeline DAG Builder
  ↓
SQL Query Generation
  ↓
DuckDB Planning (Local execution)
  ↓
Execution (Query runner)
  ↓
Results Storage (Results table)
  ↓
Catalog Update (Lineage tracking)
```

### Agent Execution Flow
```
User/API → Agent Request
  ↓
AI Runtime (LangGraph)
  ↓
Memory Lookup (Qdrant + PostgreSQL)
  ↓
Tool Invocation (MCP tools, APIs)
  ↓
LLM Call (OpenAI/Anthropic/etc)
  ↓
Result Storage (Memory system)
  ↓
Response → API/UI
```

## Technology Decisions

### Why NestJS?
- Enterprise-grade patterns (DI, modules, decorators)
- TypeScript-first with strong typing
- GraphQL + REST out of the box
- Large ecosystem and community

### Why PostgreSQL + TimescaleDB?
- ACID compliance for data consistency
- Time-series support for metrics/events
- JSON/JSONB for flexible schemas
- Proven at scale (Fortune 500 companies)

### Why Python FastAPI for AI Runtime?
- Async-native for concurrent agent tasks
- Minimal overhead (minimal boilerplate)
- Perfect for ML/AI workloads
- Easy integration with LangGraph, LangChain

### Why DuckDB for Transformations?
- Embedded SQL OLAP database
- Fast analytics on columnar data
- No server required
- Perfect for data transformation pipelines

### Why Qdrant for Vectors?
- Hybrid filtering (vector + metadata)
- Cloud-native architecture
- Self-hosted or managed
- Built-in scaling

## Deployment Architectures

### Local Development
```
docker-compose up
```
Runs all services on localhost

### Kubernetes (Production-Ready)
```
helm install atlases ./packages/infra/helm/atlases
```
- StatefulSets for databases
- Deployments for services
- ConfigMaps for config
- Secrets for sensitive data
- Ingress for routing

### AWS (Terraform)
```
terraform apply
```
- VPC + Subnets
- EKS cluster
- RDS PostgreSQL
- ElastiCache Redis
- S3 for object storage
- ECR for images

## Security Architecture

### Authentication
- JWT tokens with RS256
- OIDC/OAuth2 ready
- API key support

### Authorization
- Role-based access control (RBAC)
- Fine-grained permissions
- Open Policy Agent (Phase 5)

### Data Protection
- Encryption at rest (TDE)
- Encryption in transit (TLS 1.3)
- Vault integration (Phase 2)
- Audit logging

### Compliance
- SOC2 ready
- GDPR-compliant (Phase 5)
- HIPAA-ready (Phase 5)
- Data retention policies (Phase 5)

## Scalability Considerations

### Horizontal Scaling
- Stateless backend services
- Load balancing (Kubernetes ingress)
- Database read replicas
- Cache distribution

### Vertical Scaling
- Database tuning
- Memory optimization
- Connection pooling

### Performance Optimization
- API response caching
- Database indexing
- Query optimization
- CDN for static assets

## Monitoring & Observability

### Current (Phase 1)
- Health check endpoints
- Basic logging

### Future (Phase 6)
- OpenTelemetry integration
- Distributed tracing (Jaeger)
- Metrics (Prometheus)
- Logs (ELK stack)
- Custom dashboards (Grafana)

## API Contracts

### REST API
- OpenAPI 3.0 specification
- Swagger UI at `/api`
- Standard HTTP status codes
- JSON request/response

### GraphQL API
- Full GraphQL 2020 support
- Introspection enabled
- Playground at `/graphql`
- Real-time subscriptions (Future)

### gRPC API
- Protocol Buffers
- High-performance RPC
- Streaming support (Future)

## Roadmap Integration

- **Phase 1**: MVP with basic ingestion and agents
- **Phase 2**: Enterprise connectors (Salesforce, Jira, etc)
- **Phase 3**: Knowledge graph (Neo4j) + semantic search
- **Phase 4**: Advanced agents + self-healing
- **Phase 5**: Governance + compliance
- **Phase 6**: Advanced observability

## Further Reading

See other documentation:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guides
- [API.md](./API.md) - Complete API reference
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Developer guide
