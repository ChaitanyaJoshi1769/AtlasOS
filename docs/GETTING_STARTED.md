# Getting Started with AtlasOS

Welcome to AtlasOS - the AI-native data operating system for autonomous agents.

## Prerequisites

- **Node.js** 18+ and npm 10+
- **Python** 3.11+
- **Docker** & **Docker Compose** (for local development)
- **PostgreSQL** 15+ (or use Docker)
- **Redis** 7+ (or use Docker)
- **Git**

## Quick Start (5 minutes)

### 1. Clone and Setup

```bash
git clone https://github.com/ChaitanyaJoshi1769/AtlasOS.git
cd AtlasOS

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 2. Start All Services with Docker Compose

```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** (port 5432)
- **Redis** (port 6379)
- **MinIO** (ports 9000, 9001)
- **Qdrant** (ports 6333, 6334)
- **Kafka** (port 9092)
- **Backend API** (port 3000)
- **Frontend** (port 3001)
- **AI Runtime** (port 8000)

### 3. Access the Platform

- **Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **GraphQL**: http://localhost:3000/graphql
- **AI Runtime**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin)

## Local Development (Without Docker)

### Prerequisites

```bash
# Install PostgreSQL 15
# Install Redis 7
# Install Python 3.11
# Install Node.js 18+
```

### Backend

```bash
cd packages/backend

# Install dependencies
npm install

# Setup database
export DATABASE_URL="postgresql://atlas:password@localhost:5432/atlas"
npm run db:migrate

# Start development server
npm run dev

# GraphQL available at http://localhost:3000/graphql
# REST API at http://localhost:3000/api
```

### Frontend

```bash
cd packages/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### AI Runtime

```bash
cd packages/ai-runtime

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn src.main:app --reload --port 8000

# API docs at http://localhost:8000/docs
```

## Project Structure

```
atlases/
├── packages/
│   ├── backend/          # NestJS API services
│   ├── ai-runtime/       # Python FastAPI + LangGraph
│   ├── frontend/         # Next.js React dashboard
│   ├── infra/           # Docker, Kubernetes, Terraform
│   ├── sdk-typescript/  # TypeScript SDK
│   └── sdk-python/      # Python SDK
│
├── docs/                # Documentation
├── scripts/             # Utility scripts
└── docker-compose.yml   # Local development setup
```

## Common Commands

### Development

```bash
# Start all services (Docker)
docker-compose up

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ai-runtime

# Run tests
npm run test
npm run test:integration

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Database

```bash
# Generate migration
npm run db:generate -- src/database/migrations/initial

# Run migrations
npm run db:migrate

# Revert migration
npm run db:revert
```

### Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build -- --filter=@atlas/backend

# Build Docker images
docker-compose build --no-cache
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and update values:

```env
# Backend
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://atlas:password@localhost:5432/atlas
REDIS_URL=redis://localhost:6379

# Storage
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=atlas-data

# Vector DB
QDRANT_URL=http://localhost:6333

# LLM APIs
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

## Troubleshooting

### Port Already in Use

If a port is already in use, modify `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3000:3000"  # Change first number (host port)
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Reset database
docker-compose down -v  # Warning: Deletes data!
docker-compose up postgres

# Manually connect
psql postgresql://atlas:password@localhost:5432/atlas
```

### Redis Connection Issues

```bash
# Test Redis
redis-cli ping
# Should return: PONG
```

## Next Steps

1. **Read Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Explore API**: Visit http://localhost:3000/api and http://localhost:3000/graphql
3. **Create First Connector**: Use dashboard to connect a data source
4. **Run Sample Agent**: Execute the data quality monitoring agent
5. **Check Documentation**: See other docs in `docs/` folder

## Contributing

1. Create a feature branch
2. Make changes and test
3. Submit a pull request
4. Ensure CI passes

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Getting Help

- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Email**: contact@atlas-os.dev

## License

Apache License 2.0 - See LICENSE file
