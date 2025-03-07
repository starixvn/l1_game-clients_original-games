# Base stage for shared settings
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS base
# Add build arguments for better configurability
ARG PORT=5000
ENV PORT=$PORT

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Add necessary build dependencies
RUN apk add --no-cache libc6-compat python3 make g++
ENV YARN_CACHE_FOLDER=/root/.yarn

# Optimize yarn cache handling
RUN --mount=type=cache,target=$YARN_CACHE_FOLDER \
     yarn cache dir && yarn cache list

# Copy only package files first for better layer caching
COPY saba-nextjs/package.json saba-nextjs/yarn.lock ./
RUN --mount=type=cache,target=$YARN_CACHE_FOLDER \
     yarn install --frozen-lockfile --verbose

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies and source files
COPY --from=deps /app/node_modules ./node_modules
COPY saba-nextjs/ .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# Production stage
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add additional security hardening
RUN apk add --no-cache tini

# Install sharp for image optimization
RUN yarn add sharp

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
     && adduser --system --uid 1001 nextjs

# Create app directory structure and set permissions
RUN mkdir -p /app/.next \
     && chown -R nextjs:nodejs /app

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
     CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE $PORT

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "HOSTNAME=\"0.0.0.0\" node server.js"]
