# Build stage
FROM hub.lumigame.com/base/node:18-16-alpine-24h1.1 AS builder

# Set working directory
WORKDIR /app

# Add build arguments for better configurability
ARG PORT=5000
ENV PORT=$PORT

# Copy only package files first to leverage cache
COPY package*.json ./
COPY seal-monorepo/package*.json ./seal-monorepo/

# Install dependencies and global packages
RUN yarn install && \
    yarn global add cross-env nx open@^8.4.0

# Change to monorepo directory and install its dependencies
WORKDIR /app/seal-monorepo
RUN yarn install

# Copy the rest of the application
# This layer will only be rebuilt when files change
COPY . /app

# Build the application for development
RUN nx reset && \
    cross-env NODE_ENV=development nx build saba-games --configuration=development 

# Production stage
FROM hub.lumigame.com/base/nginx:stable-alpine-slim

# Copy the build output to the Nginx directory
COPY --from=builder /app/seal-monorepo/dist/libs/saba-games /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

# Switch to nginx user
USER nginx

# Expose the port Nginx is running on
EXPOSE $PORT

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
