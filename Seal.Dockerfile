# Build stage
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS builder
WORKDIR /app

# Add necessary build dependencies
RUN apk add --no-cache libc6-compat

# Copy package files first for better caching
COPY seal-monorepo/package.json seal-monorepo/yarn.lock ./
COPY seal-monorepo/nx.json ./
COPY seal-monorepo/tsconfig*.json ./
COPY seal-monorepo/jest.* ./
COPY seal-monorepo/.env ./
COPY seal-monorepo/.eslintrc.json ./

# Install dependencies
RUN yarn config set cache-folder /root/.yarn && \
    yarn install --frozen-lockfile

# Copy source files
COPY seal-monorepo/libs ./libs
COPY seal-monorepo/apps ./apps
COPY seal-monorepo/scripts ./scripts

# Remove any existing dist directory to avoid conflicts
RUN rm -rf dist apps/seal-components/dist

# Build the application
RUN --mount=type=cache,target=/root/.nx-cache \
    NX_CACHE_DIRECTORY=/root/.nx-cache yarn nx build saba-games --prod

# Production stage
FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS runner
WORKDIR /app

ARG PORT=4200
ENV PORT=$PORT \
    HOST=0.0.0.0 \
    NODE_ENV=production \
    PATH="/app/node_modules/.bin:$PATH"

# Add tini and create non-root user
RUN apk add --no-cache tini && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app && \
    chown -R nextjs:nodejs /app

# Install serve for static file serving
RUN yarn global add serve@14.2.1

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist/libs/saba-games /app/dist

# Create serve.json configuration
RUN echo '{\
    "headers": [\
    {\
    "source": "**/*.js",\
    "headers": [{\
    "key": "Content-Type",\
    "value": "application/javascript; charset=utf-8"\
    }]\
    },\
    {\
    "source": "**/*.mjs",\
    "headers": [{\
    "key": "Content-Type",\
    "value": "application/javascript; charset=utf-8"\
    }]\
    }\
    ],\
    "rewrites": [\
    { "source": "/saba-games/**", "destination": "/index.html" },\
    { "source": "/**", "destination": "/index.html" }\
    ]\
    }' > /app/dist/serve.json

# Create startup script
RUN printf '#!/bin/sh\ncd /app/dist\nexec serve -s . --listen ${PORT} --cors --single' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh && \
    chown nextjs:nodejs /docker-entrypoint.sh

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/saba-games/ || exit 1

USER nextjs
EXPOSE $PORT

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/docker-entrypoint.sh"] 