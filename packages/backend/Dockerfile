# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package*.json turbo.json ./
COPY packages/backend ./packages/backend

# Install dependencies
RUN npm ci

# Build backend
RUN npm run build -- --filter=@atlas/backend

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./
COPY packages/backend/package.json ./packages/backend/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "packages/backend/dist/main.js"]
