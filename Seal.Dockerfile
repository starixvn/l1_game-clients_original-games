# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Add build arguments for better configurability
ARG PORT=5000
ENV PORT=$PORT

# Copy package files
COPY package*.json ./

# Install dependencies and global packages
RUN yarn install && \
    yarn global add cross-env nx

# Copy the rest of the application
COPY . .

# Build the application for development
WORKDIR /app/seal-monorepo
RUN yarn install && \
    nx reset && \
    cross-env NODE_ENV=development nx build saba-games --configuration=development && \
    mkdir -p dist/libs/saba-games/static && \
    cp -r libs/saba-games/public/static/* dist/libs/saba-games/static/

# Production stage
FROM nginx:alpine

# Copy the build output to the Nginx directory
COPY --from=builder /app/seal-monorepo/dist/libs/saba-games /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories and set permissions
RUN mkdir -p /usr/share/nginx/html/static/images/cards && \
    chown -R nginx:nginx /usr/share/nginx/html

# Expose the port Nginx is running on
EXPOSE $PORT

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
