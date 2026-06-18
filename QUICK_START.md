# AtlasOS Quick Start Guide

## 🚀 Start AtlasOS in 5 Minutes

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+ (for local development)
- Python 3.11+ (for local AI runtime)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/ChaitanyaJoshi1769/AtlasOS.git
cd AtlasOS

# Start all services
docker-compose up

# Wait for services to be healthy (2-3 minutes)
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start backend
cd packages/backend
npm run dev

# In another terminal, start frontend
cd packages/frontend
npm run dev

# In another terminal, start AI runtime
cd packages/ai-runtime
python -m uvicorn src.main:app --reload --port 8000
```

---

## 📱 Access the Platform

Once running:

| Service | URL | Default Credentials |
|---------|-----|-------------------|
| **Dashboard** | http://localhost:3001 | N/A |
| **Backend API** | http://localhost:3000 | N/A |
| **GraphQL** | http://localhost:3000/graphql | N/A |
| **AI Runtime** | http://localhost:8000/docs | N/A |
| **MinIO Console** | http://localhost:9001 | minioadmin / minioadmin |
| **PostgreSQL** | localhost:5432 | atlas / password |
| **Redis** | localhost:6379 | (no auth) |

---

## 🎯 First Steps

### 1. Create Your First Connector

```bash
curl -X POST http://localhost:3000/api/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My PostgreSQL",
    "type": "postgresql",
    "config": {
      "host": "localhost",
      "port": 5432,
      "database": "mydb"
    },
    "credentials": {
      "username": "user",
      "password": "pass"
    }
  }'
```

### 2. Test the Connection

```bash
curl -X POST http://localhost:3000/api/connectors/{id}/test
```

### 3. Trigger Data Ingestion

```bash
curl -X POST http://localhost:3000/api/connectors/{id}/sync
```

### 4. Browse the Catalog

```bash
curl http://localhost:3000/api/catalog
```

### 5. Create a Transformation Pipeline

```bash
curl -X POST http://localhost:3000/api/pipelines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Deduplication",
    "description": "Remove duplicate customers",
    "dag": {
      "nodes": [
        {"id": "source", "type": "source", "data": {"table": "customers"}},
        {"id": "dedup", "type": "transform", "data": {"sql": "SELECT DISTINCT * FROM customers"}},
        {"id": "sink", "type": "sink", "data": {"table": "customers_clean"}}
      ],
      "edges": [
        {"source": "source", "target": "dedup"},
        {"source": "dedup", "target": "sink"}
      ]
    }
  }'
```

---

## 🔍 Key API Endpoints

### Connectors
```
POST   /api/connectors              # Create connector
GET    /api/connectors              # List connectors
GET    /api/connectors/:id          # Get connector
PATCH  /api/connectors/:id          # Update connector
DELETE /api/connectors/:id          # Delete connector
POST   /api/connectors/:id/test     # Test connection
POST   /api/connectors/:id/sync     # Trigger sync
```

### Catalog
```
GET    /api/catalog                 # List datasets
GET    /api/catalog/:id             # Get dataset
GET    /api/catalog/search?q=query  # Search datasets
GET    /api/catalog/:id/columns     # Get columns
POST   /api/catalog/:id/statistics  # Update statistics
```

### Pipelines
```
POST   /api/pipelines               # Create pipeline
GET    /api/pipelines               # List pipelines
GET    /api/pipelines/:id           # Get pipeline
PATCH  /api/pipelines/:id           # Update pipeline
POST   /api/pipelines/:id/validate  # Validate DAG
POST   /api/pipelines/:id/execute   # Execute pipeline
GET    /api/pipelines/:id/runs      # Get runs
```

### Knowledge Graph
```
POST   /api/knowledge-graph/entities            # Create entity
GET    /api/knowledge-graph/search?q=query      # Semantic search
GET    /api/knowledge-graph/entities/:id/lineage # View lineage
GET    /api/knowledge-graph/entities/:id/impact  # Impact analysis
POST   /api/knowledge-graph/glossary            # Add term
GET    /api/knowledge-graph/glossary            # Browse glossary
```

### Agents
```
GET    /api/agents                              # List agents
GET    /api/agents/:id/status                   # Agent status
GET    /api/agents/:id/metrics                  # Performance metrics
POST   /api/agents/:id/tasks                    # Assign task
POST   /api/orchestration/delegate              # Delegate task
GET    /api/orchestration/health                # System health
POST   /api/orchestration/execute               # Execute all tasks
```

---

## 🐳 Docker Compose Services

```yaml
postgres      # Operational database + TimescaleDB
redis         # Cache and job queue
minio         # S3-compatible object storage
qdrant        # Vector database
kafka         # Event streaming
zookeeper     # Kafka coordination
backend       # NestJS API
frontend      # Next.js UI
ai-runtime    # Python FastAPI agents
```

---

## 🔐 Security & Authentication

### JWT Tokens
All protected endpoints require JWT token in header:
```bash
Authorization: Bearer <token>
```

### Default Credentials
- PostgreSQL: `atlas` / `password`
- MinIO: `minioadmin` / `minioadmin`
- No authentication required for local development

### Production Setup
1. Change all default passwords
2. Enable SSL/TLS
3. Configure OIDC/OAuth2
4. Set up API keys
5. Enable audit logging

---

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# Liveness check
curl http://localhost:3000/health

# Readiness check
curl http://localhost:3000/health/ready

# Liveness (alternative)
curl http://localhost:3000/health/live
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f ai-runtime
docker-compose logs -f frontend
```

---

## 🛠️ Common Tasks

### Create a Data Quality Check
```bash
curl -X POST http://localhost:8000/api/agents/dq_agent/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Check Customer Data Quality",
    "task_type": "data_quality_check",
    "parameters": {
      "dataset_id": "customers",
      "check_duplicates": true,
      "check_schema": true,
      "missing_threshold": 0.1
    }
  }'
```

### Analyze Costs
```bash
curl -X POST http://localhost:8000/api/agents/cost_agent/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analyze Pipeline Costs",
    "task_type": "cost_analysis",
    "parameters": {
      "pipeline_id": "revenue_pipeline"
    }
  }'
```

### Search the Knowledge Graph
```bash
curl "http://localhost:3000/api/knowledge-graph/search?q=customer&limit=10"
```

### Get Impact Analysis
```bash
curl "http://localhost:3000/api/knowledge-graph/entities/{id}/impact"
```

---

## 🚢 Deployment

### To Kubernetes
```bash
# Install Helm chart
helm install atlas ./packages/infra/helm/atlas \
  --values ./packages/infra/helm/atlas/values.yaml

# Check status
kubectl get pods -n atlas
kubectl logs -f deployment/atlas-backend -n atlas
```

### To AWS
```bash
cd packages/infra/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply configuration
terraform apply tfplan
```

---

## 📚 Documentation

- **[GETTING_STARTED.md](docs/GETTING_STARTED.md)** - Detailed setup guide
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design
- **[PHASE_SUMMARY.md](docs/PHASE_SUMMARY.md)** - Complete feature breakdown
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Developer guide

---

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Clear volumes and restart
docker-compose down -v
docker-compose up
```

### Database Connection Issues
```bash
# Check PostgreSQL
docker-compose exec postgres psql -U atlas -d atlas -c "SELECT 1"

# Check Redis
docker-compose exec redis redis-cli ping

# Check connectivity
docker-compose exec backend npm run db:migrate
```

### AI Runtime Issues
```bash
# Check Python environment
docker-compose exec ai-runtime python -c "import fastapi; print('OK')"

# View detailed logs
docker-compose logs ai-runtime --follow
```

---

## 🔄 Development Workflow

### Make Code Changes
```bash
# Backend
cd packages/backend
# Edit files
npm run lint:fix
npm run type-check
npm test

# Frontend
cd packages/frontend
# Edit files
npm run lint
npm run build

# AI Runtime
cd packages/ai-runtime
# Edit files
black src/
pytest tests/
```

### Commit & Push
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Create Pull Request
```bash
gh pr create --title "feat: add new feature" \
  --body "Description of changes"
```

---

## ✅ Next Steps

1. ✅ Start the platform (`docker-compose up`)
2. ✅ Explore the dashboard (http://localhost:3001)
3. ✅ Create your first connector
4. ✅ Ingest some data
5. ✅ Create a transformation pipeline
6. ✅ Browse the knowledge graph
7. ✅ Trigger a data quality check
8. ✅ Review audit logs
9. ✅ Deploy to Kubernetes or AWS

---

## 📞 Support

- **GitHub Issues**: Report bugs
- **GitHub Discussions**: Ask questions
- **Documentation**: See `/docs` folder
- **Code**: Available at https://github.com/ChaitanyaJoshi1769/AtlasOS

---

**Happy building! 🚀**
