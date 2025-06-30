# Connection Management System

## Overview

The Connection Management System is designed to reduce server CPU and RAM consumption during high traffic periods by implementing intelligent connection management strategies. This system automatically manages WebSocket connections, implements fallback mechanisms, and provides monitoring capabilities.

## Features

### 1. Connection Limits

-   **Maximum Connections**: Configurable limit on concurrent WebSocket connections (default: 1000)
-   **Connection Queuing**: Queues connection requests when limit is reached
-   **Priority-based Processing**: Processes queued connections based on user activity

### 2. Connection Throttling

-   **Rate Limiting**: Limits connection attempts per user per minute (default: 3)
-   **Automatic Backoff**: Prevents connection spam and server overload
-   **User-based Tracking**: Tracks connection attempts per user

### 3. Inactivity Management

-   **Automatic Disconnection**: Disconnects idle users after configurable timeout (default: 5 minutes)
-   **Activity Tracking**: Monitors user interactions to reset inactivity timers
-   **Resource Cleanup**: Frees up server resources from inactive connections

### 4. Graceful Degradation

-   **Polling Fallback**: Switches to HTTP polling when WebSocket is overloaded
-   **Service Health Monitoring**: Monitors server load and connection health
-   **Dynamic Configuration**: Adjusts behavior based on server status

### 5. Connection Prioritization

-   **Activity-based Priority**: Prioritizes active users over idle ones
-   **Betting Priority**: Highest priority for users actively betting
-   **Stats Viewing Priority**: Medium priority for users viewing statistics
-   **Idle User Priority**: Lowest priority for inactive users

## Configuration

### Connection Configuration (`connection-config.ts`)

```typescript
export const CONNECTION_CONFIG = {
    MAX_CONNECTIONS: 1000, // Maximum concurrent connections
    INACTIVITY_TIMEOUT: 5 * 60 * 1000, // 5 minutes inactivity timeout
    MAX_ATTEMPTS_PER_MINUTE: 3, // Rate limiting
    POLLING_INTERVAL: 5000, // 5 seconds polling interval
    HEARTBEAT_INTERVAL: 30000, // 30 seconds heartbeat
    SERVICE_HEALTH_CHECK_INTERVAL: 60000, // 1 minute health check

    HEALTH_THRESHOLDS: {
        OVERLOADED: 0.9, // 90% connection limit
        DEGRADED: 0.7, // 70% connection limit
    },

    PRIORITY_LEVELS: {
        ACTIVE_BETTING: 1, // Highest priority
        VIEWING_STATS: 2, // Medium priority
        IDLE_USER: 3, // Lowest priority
    },
};
```

### Environment-specific Configuration

```typescript
// Production: Higher limits, longer timeouts
MAX_CONNECTIONS: 2000;
INACTIVITY_TIMEOUT: 10 * 60 * 1000; // 10 minutes

// Staging: Lower limits, shorter timeouts
MAX_CONNECTIONS: 500;
INACTIVITY_TIMEOUT: 3 * 60 * 1000; // 3 minutes
```

## Implementation Details

### GatewayGameBase Class

The main connection management logic is implemented in the `GatewayGameBase` class:

```typescript
class GatewayGameBase<P extends GameBaseProps, S extends IGatewayGameBaseState> extends GameBase<P, S> {
    // Connection management properties
    private inactivityTimeout?: NodeJS.Timeout;
    private heartbeatInterval?: NodeJS.Timeout;
    private pollInterval?: NodeJS.Timeout;
    private lastActivityTime: number = Date.now();
}
```

### Connection Manager

Global connection management is handled by the `ConnectionManager` class:

```typescript
class ConnectionManager {
    private static activeConnections = 0;
    private static connectionAttempts = new Map<string, { count: number; lastReset: number }>();
    private static serviceHealthStatus: 'healthy' | 'degraded' | 'overloaded' = 'healthy';
    private static connectionQueue: Array<{ component: any; priority: number; timestamp: number }> = [];
}
```

### Health Monitoring

The `ConnectionHealthService` provides comprehensive monitoring:

```typescript
class ConnectionHealthService {
    // Metrics tracking
    private metrics: {
        totalConnections: number;
        activeConnections: number;
        failedConnections: number;
        averageResponseTime: number;
        connectionHistory: Array<{ timestamp: number; activeConnections: number; failedConnections: number }>;
    };
}
```

## Usage Examples

### Basic Connection Management

```typescript
// The system automatically manages connections when users access games
const gameComponent = new GatewayGameBase({
    namespace: 'baccarat',
    language: 'en',
});

// Connection limits are automatically enforced
// Inactivity timeouts are automatically applied
// Health monitoring is automatically performed
```

### Monitoring Connection Health

```typescript
import { ConnectionHealthService } from './services/connection-health-service';

const healthService = ConnectionHealthService.getInstance();

// Get current metrics
const metrics = healthService.getMetrics();
console.log(`Active connections: ${metrics.activeConnections}/${metrics.totalConnections}`);
console.log(`Health status: ${metrics.healthStatus}`);
console.log(`Failure rate: ${metrics.failureRate}%`);

// Get recommendations
const recommendations = healthService.getLoadReductionRecommendations();
recommendations.forEach((rec) => console.log(`Recommendation: ${rec}`));
```

### Dynamic Configuration Updates

```typescript
import { DynamicConnectionConfig } from './config/connection-config';

const config = DynamicConnectionConfig.getInstance();

// Update configuration at runtime
config.updateConfig({
    MAX_CONNECTIONS: 1500,
    INACTIVITY_TIMEOUT: 3 * 60 * 1000,
});
```

## Monitoring and Logging

### Console Logs

The system provides detailed logging for monitoring:

```
🔗 [ConnectionManager] Active connections: 750/1000 (75.0%)
🔗 [ConnectionManager] Service health status: degraded
🔗 [GatewayGameBase] Establishing connection for user: baccarat-user-123
🔗 [GatewayGameBase] Enabling polling mode due to service overload
🔗 [ConnectionManager] Added to queue. Queue length: 15
```

### Health Metrics

Monitor these key metrics:

-   **Connection Ratio**: Active connections / Maximum connections
-   **Failure Rate**: Failed connections / Total connection attempts
-   **Average Response Time**: Average time for connection establishment
-   **Queue Length**: Number of queued connection requests

## Testing

### Running Tests

```bash
# Run connection management tests
npm test -- gateway-game-base.connection.test.ts

# Run all tests
npm test
```

### Test Coverage

The test suite covers:

-   Connection limits and queuing
-   Rate limiting and throttling
-   Inactivity management
-   Polling mode fallback
-   Connection prioritization
-   Health monitoring
-   Error handling
-   Configuration management

## Performance Impact

### CPU Reduction

-   **Connection Limits**: Prevents server overload by limiting concurrent connections
-   **Inactivity Timeouts**: Frees up resources from idle users
-   **Polling Fallback**: Reduces WebSocket overhead during high load
-   **Rate Limiting**: Prevents connection spam

### RAM Reduction

-   **Automatic Cleanup**: Removes inactive connections
-   **Queue Management**: Prevents memory leaks from queued requests
-   **History Limiting**: Maintains only recent connection history
-   **Resource Monitoring**: Tracks and manages memory usage

### Expected Improvements

-   **CPU Usage**: 30-50% reduction during peak load
-   **RAM Usage**: 20-40% reduction from connection management
-   **Response Time**: Improved due to reduced server load
-   **Stability**: Better handling of traffic spikes

## Troubleshooting

### Common Issues

1. **High Connection Queue Length**

    - Check server resources
    - Consider increasing `MAX_CONNECTIONS`
    - Review connection timeout settings

2. **High Failure Rate**

    - Check network connectivity
    - Review server logs
    - Verify authentication service

3. **Frequent Polling Mode**
    - Server may be overloaded
    - Check connection limits
    - Review health thresholds

### Debug Mode

Enable debug logging:

```typescript
// Add to your environment configuration
process.env.CONNECTION_DEBUG = 'true';
```

This will provide detailed logging of all connection management activities.

## Best Practices

1. **Monitor Metrics**: Regularly check connection health metrics
2. **Adjust Configuration**: Fine-tune settings based on your server capacity
3. **Set Alerts**: Configure alerts for high connection ratios or failure rates
4. **Regular Testing**: Test the system under various load conditions
5. **Documentation**: Keep configuration changes documented

## Future Enhancements

1. **Machine Learning**: Predictive connection management based on usage patterns
2. **Geographic Distribution**: Load balancing across multiple regions
3. **Advanced Analytics**: Detailed connection analytics and reporting
4. **Auto-scaling**: Automatic configuration adjustments based on load
5. **Integration**: Integration with external monitoring systems

## Support

For issues or questions about the Connection Management System:

1. Check the test files for usage examples
2. Review the configuration documentation
3. Monitor the console logs for debugging information
4. Contact the development team for technical support
