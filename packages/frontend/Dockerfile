# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json turbo.json ./
COPY packages/frontend ./packages/frontend

RUN npm ci
RUN npm run build -- --filter=@atlas/frontend

# Runtime stage
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
COPY packages/frontend/package.json ./packages/frontend/

RUN npm ci --omit=dev

COPY --from=builder /app/packages/frontend/.next ./packages/frontend/.next
COPY --from=builder /app/packages/frontend/public ./packages/frontend/public

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start", "--prefix", "packages/frontend"]
