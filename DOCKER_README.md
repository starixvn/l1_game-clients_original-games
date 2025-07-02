# Docker Setup for Original Games

This document provides instructions for building and running the Original Games application using Docker.

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up --build

# Run in background
docker-compose up -d

# Stop the application
docker-compose down
```

### Using Docker directly

```bash
# Build the image
docker build -t original-games:latest .

# Run the container
docker run -p 5000:5000 original-games:latest
```

### Using the build script

```bash
# Make script executable (Linux/Mac)
chmod +x scripts/docker-build.sh

# Build with default settings
./scripts/docker-build.sh

# Build with specific tag
./scripts/docker-build.sh -t v1.0.0

# Build only up to builder stage (for development)
./scripts/docker-build.sh -b builder
```

## 🏗️ Docker Architecture

The Dockerfile uses a multi-stage build approach:

1. **base**: Base Node.js Alpine image
2. **deps**: Install dependencies with caching
3. **builder**: Build the Next.js application
4. **runner**: Production-ready image with minimal footprint

### Build Stages

- **deps**: Installs all dependencies (including dev dependencies)
- **builder**: Compiles TypeScript and builds the Next.js application
- **runner**: Creates the final production image with only runtime dependencies

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `PORT` | `5000` | Application port |
| `HOSTNAME` | `0.0.0.0` | Host binding for Next.js |

### Ports

- **5000**: Application port (configurable via `PORT` env var)

## 🏥 Health Checks

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "memory": {
    "used": 12345678,
    "total": 23456789
  }
}
```

## 🔒 Security Features

- **Non-root user**: Application runs as `nextjs` user (UID 1001)
- **Minimal base image**: Uses Alpine Linux for smaller attack surface
- **Multi-stage build**: Reduces final image size
- **No sensitive data**: Configuration files are properly handled

## 📊 Performance Optimizations

### Build Optimizations

- **Layer caching**: Dependencies are cached separately from source code
- **Yarn cache**: Uses Docker build cache for yarn packages
- **Multi-stage build**: Only runtime dependencies in final image
- **Optimized .dockerignore**: Excludes unnecessary files

### Runtime Optimizations

- **Standalone output**: Uses Next.js standalone mode for optimal performance
- **Alpine Linux**: Minimal base image for faster startup
- **Resource limits**: Configurable memory and CPU limits in docker-compose

## 🛠️ Development

### Development Build

```bash
# Build only up to builder stage
docker build --target builder -t original-games:dev .

# Run with volume mounting for development
docker run -p 5000:5000 -v $(pwd)/src:/app/src original-games:dev
```

### Debugging

```bash
# Run with interactive shell
docker run -it --entrypoint /bin/sh original-games:latest

# View logs
docker logs <container_id>

# Check health
curl http://localhost:5000/api/health
```

## 📦 Production Deployment

### Docker Compose (Production)

```bash
# Start with nginx reverse proxy
docker-compose --profile production up -d
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: original-games
spec:
  replicas: 3
  selector:
    matchLabels:
      app: original-games
  template:
    metadata:
      labels:
        app: original-games
    spec:
      containers:
      - name: app
        image: original-games:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
          requests:
            memory: "512Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## 🔍 Troubleshooting

### Common Issues

1. **Build fails with "standalone not found"**
   - Ensure `output: 'standalone'` is set in `next.config.js`

2. **Permission denied errors**
   - The application runs as non-root user (UID 1001)
   - Ensure proper file permissions

3. **Health check fails**
   - Check if the application is running on port 5000
   - Verify the `/api/health` endpoint is accessible

4. **Memory issues**
   - Adjust memory limits in docker-compose.yml
   - Monitor with `docker stats`

### Debug Commands

```bash
# Check container status
docker ps -a

# View container logs
docker logs <container_id>

# Inspect container
docker inspect <container_id>

# Check resource usage
docker stats <container_id>
```

## 📈 Monitoring

### Metrics

The health endpoint provides basic metrics:
- Application uptime
- Memory usage
- Response status

### Logging

Application logs are available via:
```bash
docker logs <container_id> -f
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build Docker image
      run: |
        docker build -t original-games:${{ github.sha }} .
        docker tag original-games:${{ github.sha }} original-games:latest
    - name: Push to registry
      run: |
        docker push original-games:${{ github.sha }}
        docker push original-games:latest
```

## 📚 Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Alpine Linux](https://alpinelinux.org/) 