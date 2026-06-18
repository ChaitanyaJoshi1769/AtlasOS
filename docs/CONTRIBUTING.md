# Contributing to AtlasOS

Thank you for your interest in contributing to AtlasOS! We welcome contributions from everyone.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Follow the development setup in [GETTING_STARTED.md](./GETTING_STARTED.md)

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages
Use conventional commits:
```
type(scope): description

feat(backend): add new ingestion endpoint
fix(frontend): correct button alignment
docs(readme): update installation instructions
```

### Code Style

#### TypeScript
- Use ESLint configuration
- Run `npm run lint:fix` to auto-fix
- 2-space indentation
- Meaningful variable names
- Add JSDoc comments for public APIs

#### Python
- Use Black for formatting
- Follow PEP 8
- Use type hints
- Run `black src/` and `isort src/`

#### General
- No console.log in production code
- Remove commented-out code
- Add tests for new features
- Update documentation

## Testing

Before submitting a PR, ensure:

```bash
# Run all tests
npm run test

# Run integration tests
npm run test:integration

# Check types
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## Pull Request Process

1. **Update branch**: `git fetch origin && git rebase origin/main`
2. **Run tests**: All tests must pass
3. **Document changes**: Update relevant docs
4. **Create PR** with detailed description:
   - What does this PR do?
   - Why is this change needed?
   - How was it tested?
   - Any breaking changes?

5. **Wait for review**: Address feedback from maintainers
6. **Merge**: Once approved, merge to main

## Code Review Guidelines

When reviewing code:
- Check functionality and correctness
- Verify tests are included
- Ensure code style consistency
- Look for potential performance issues
- Request documentation updates if needed

## Documentation

- Update README.md if adding features
- Add docstrings to functions/classes
- Update architecture docs if changing design
- Add examples for new APIs

## Reporting Issues

When reporting bugs:
- Include reproduction steps
- Attach error messages/logs
- Specify your environment (OS, Node version, etc.)
- Provide expected vs actual behavior

When requesting features:
- Explain the use case
- Describe the desired behavior
- Provide examples if possible

## Project Structure

```
packages/
├── backend/          # NestJS API
├── ai-runtime/       # Python FastAPI
├── frontend/         # Next.js
├── infra/           # Infrastructure
├── sdk-typescript/  # TS SDK
└── sdk-python/      # Python SDK
```

## Key Technologies

- **Backend**: NestJS, TypeORM, PostgreSQL, GraphQL
- **Frontend**: Next.js, React, TailwindCSS
- **AI**: FastAPI, LangGraph, Qdrant
- **Infrastructure**: Docker, Kubernetes, Terraform

## Development Tips

### Local Development
```bash
# Start all services
docker-compose up

# Watch for changes
npm run dev

# Debug Backend
npm run backend:dev
```

### Database
```bash
# Generate migration
npm run db:generate -- src/database/migrations/name

# Run migrations
npm run db:migrate
```

### Running Tests
```bash
# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Questions?

- Check existing issues/discussions
- Ask in GitHub Discussions
- Email: contact@atlas-os.dev

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.

Happy coding! 🚀
