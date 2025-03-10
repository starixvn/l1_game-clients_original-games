# Build stage
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS builder
WORKDIR /app

# Add only necessary build dependencies
RUN apk add --no-cache libc6-compat

# Copy package files for dependency installation
COPY seal-monorepo/package.json seal-monorepo/yarn.lock ./
COPY seal-monorepo/nx.json seal-monorepo/tsconfig*.json seal-monorepo/jest.*.* ./

# Install dependencies with caching
RUN yarn config set cache-folder /root/.yarn && \
    yarn install --frozen-lockfile --production=false --network-timeout 1000000 && \
    yarn cache clean

# Copy source code - only the necessary directories
COPY seal-monorepo/libs/ ./libs/
COPY seal-monorepo/scripts/ ./scripts/

# Build the application with cache mount for nx
RUN --mount=type=cache,target=/root/.nx-cache \
    NX_CACHE_DIRECTORY=/root/.nx-cache \
    yarn nx build saba-games --configuration=production --verbose

# Production stage
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS runner
WORKDIR /app

ARG PORT=4200
ENV PORT=$PORT \
    HOST=0.0.0.0 \
    NODE_ENV=production \
    PATH="/app/node_modules/.bin:$PATH" \
    PUBLIC_URL="/saba-games"

# Add tini and create non-root user
RUN apk add --no-cache tini && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app && \
    chown -R nextjs:nodejs /app

# Install serve for static file serving
RUN yarn global add serve@14.2.1

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist/libs/saba-games ./dist/

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/saba-games/ || exit 1

USER nextjs
EXPOSE $PORT

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["serve", "-s", "dist", "--listen", "4200", "--cors", "--single"] 