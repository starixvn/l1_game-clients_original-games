# Base stage for shared settings
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS base
# Add build arguments for better configurability
ARG PORT=5000
ENV PORT=$PORT
ENV HOST=0.0.0.0

FROM base AS deps
WORKDIR /app

# Add dependencies for native builds
RUN apk add --no-cache libc6-compat python3 make g++

# Copy root level configuration files first
COPY seal-monorepo/package.json seal-monorepo/yarn.lock ./
COPY seal-monorepo/nx.json seal-monorepo/tsconfig.base.json seal-monorepo/tsconfig.json seal-monorepo/jest.config.ts seal-monorepo/jest.preset.js ./

# Copy all package.json files from apps and libs
COPY seal-monorepo/apps/**/package.json ./apps/
COPY seal-monorepo/libs/**/package.json ./libs/

# Install dependencies in separate steps for better error handling
RUN yarn config set cache-folder /root/.yarn && \
    yarn install --frozen-lockfile --network-timeout 1000000

# Install additional build dependencies
RUN yarn add -W -D webpack@5.x webpack-cli@5.x @nrwl/webpack

# Install nx globally
RUN yarn global add nx@latest

FROM base AS builder
WORKDIR /app

# Copy dependencies and configuration
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/nx.json ./nx.json
COPY --from=deps /app/tsconfig*.json ./
COPY --from=deps /app/jest.*.* ./

# Copy source code
COPY seal-monorepo/apps/ ./apps/
COPY seal-monorepo/libs/ ./libs/
COPY seal-monorepo/scripts/ ./scripts/

# Build saba-games specifically
ENV NODE_ENV=production
RUN yarn nx build saba-games --verbose && node scripts/copy-saba-games.js

FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Add additional security hardening
RUN apk add --no-cache tini

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Create app directory structure and set permissions
RUN mkdir -p /app/dist \
    && chown -R nextjs:nodejs /app

# Copy build output and necessary files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE $PORT

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["yarn", "start:window"] 