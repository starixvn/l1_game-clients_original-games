FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS base

FROM base AS deps
WORKDIR /app

# Add dependencies for native builds
RUN apk add --no-cache libc6-compat python3 make g++
ENV YARN_CACHE_FOLDER=/root/.yarn

# Copy root level configuration files
COPY package.json yarn.lock ./
COPY nx.json tsconfig.base.json tsconfig.json jest.config.ts jest.preset.js ./

# Copy all package.json files from apps and libs
COPY apps/**/package.json ./apps/
COPY libs/**/package.json ./libs/

# Install dependencies with cache mount
RUN --mount=type=cache,target=$YARN_CACHE_FOLDER \
    yarn install --frozen-lockfile --network-timeout 1000000 && \
    yarn global add nx@latest

FROM base AS builder
WORKDIR /app

# Copy dependencies and configuration
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/nx.json ./nx.json
COPY --from=deps /app/tsconfig*.json ./
COPY --from=deps /app/jest.*.* ./

# Copy source code
COPY apps/ ./apps/
COPY libs/ ./libs/
COPY scripts/ ./scripts/
COPY public/ ./public/

# Build all projects in the monorepo
RUN yarn nx run-many --target=build --all --prod

FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS runner
WORKDIR /app
ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy build output and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 5000
ENV PORT 5000
ENV HOST 0.0.0.0

CMD ["yarn", "start:window"] 