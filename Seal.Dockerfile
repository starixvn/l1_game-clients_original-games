# Base stage for shared settings
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS base
ARG PORT=5000
ENV PORT=$PORT \
    HOST=0.0.0.0 \
    NODE_ENV=production \
    PATH="/app/node_modules/.bin:$PATH"

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Add only necessary build dependencies
RUN apk add --no-cache libc6-compat

# Copy only package files first to leverage cache
COPY seal-monorepo/package.json seal-monorepo/yarn.lock ./
COPY seal-monorepo/nx.json seal-monorepo/tsconfig*.json seal-monorepo/jest.*.* ./

# Install dependencies with yarn cache mounted
RUN --mount=type=cache,target=/root/.yarn \
    yarn config set cache-folder /root/.yarn && \
    yarn install --frozen-lockfile --production=false --network-timeout 1000000 && \
    yarn add -W -D webpack@5.88.2 webpack-cli@5.1.4 @nrwl/webpack@15.9.2 @nrwl/workspace@15.9.2 && \
    yarn global add nx@15.9.2 && \
    # Clean up unnecessary files
    yarn cache clean

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app/nx.json /app/tsconfig*.json /app/jest.*.* ./

# Copy source code
COPY seal-monorepo/libs/ ./libs/
COPY seal-monorepo/scripts/ ./scripts/
COPY seal-monorepo/apps/seal-components ./apps/seal-components

# Build with cache mount for nx
RUN --mount=type=cache,target=/root/.nx-cache \
    NX_CACHE_DIRECTORY=/root/.nx-cache \
    yarn nx build seal-components --verbose && \
    node scripts/copy-saba-games.js

# Production stage
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS runner
WORKDIR /app

# Add tini and create non-root user in one layer
RUN apk add --no-cache tini && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/dist && \
    chown -R nextjs:nodejs /app

# Copy only production necessary files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
# Install only production dependencies
COPY --from=builder --chown=nextjs:nodejs /app/yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --production=true --network-timeout 1000000 && \
    yarn cache clean

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

USER nextjs
EXPOSE $PORT

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["yarn", "start:window"] 