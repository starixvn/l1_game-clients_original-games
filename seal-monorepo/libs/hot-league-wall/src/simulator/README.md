# Simulator System

This directory contains the simulation system for testing various aspects of the game client, including SSO authentication and connection management.

## Overview

The simulator system provides tools for testing and debugging different scenarios in a controlled environment. It includes:

-   **SSO Simulator**: Test authentication flows and failure scenarios
-   **Connection Management Simulator**: Test connection limits, load balancing, and performance scenarios
-   **Prototype State Management**: Manage application state during testing
-   **Token Request Simulation**: Simulate token requests and responses

## Components

### SSO Control Simulator

Located in `../_shared/components/sso-control-simulator/`

-   **useSSOSimulator**: Hook for managing SSO simulation state
-   **SSOControlSimulator**: UI component for SSO testing
-   **SSOScenarios**: Predefined SSO test scenarios

### Connection Management Simulator

Located in `./hooks/` and `./components/`

-   **useConnectionSimulator**: Hook for managing connection simulation state
-   **ConnectionControlSimulator**: UI component for connection testing
-   **ConnectionScenarios**: Predefined connection test scenarios

## Usage

### Basic Setup

```typescript
import {
    useSSOSimulator,
    useConnectionSimulator,
    ConnectionControlSimulatorWrapper
} from './simulator';

// In your component
const ssoSimulator = useSSOSimulator();
const connectionSimulator = useConnectionSimulator();

// Wrap your app with the simulator
<ConnectionControlSimulatorWrapper>
    <YourApp />
</ConnectionControlSimulatorWrapper>
```

### SSO Simulation

```typescript
// Toggle SSO failure mode
ssoSimulator.toggleFailure();

// Set failure count
ssoSimulator.setFailCount(3);

// Select predefined scenario
ssoSimulator.selectScenario({
    id: 'persistent-failure',
    name: 'Persistent Failure',
    description: 'Simulates persistent SSO failures',
    settings: {
        isFailureMode: true,
        failCount: 5,
    },
});
```

### Connection Management Simulation

```typescript
// Start connection simulation
connectionSimulator.toggleSimulation();

// Simulate different load levels
connectionSimulator.simulateLoadLevel('overloaded');

// Select predefined scenario
connectionSimulator.selectScenario({
    id: 'server-overload',
    name: 'Server Overload',
    description: 'High load with connection queuing',
    loadLevel: 'overloaded',
    settings: {
        maxConnections: 1000,
        failureRate: 25,
        responseTimeDelay: 2000,
    },
});

// Manual connection control
connectionSimulator.simulateConnectionAttempts(50);
connectionSimulator.simulateConnectionClosures(10);
```

## Predefined Scenarios

### SSO Scenarios

1. **Normal Flow**: Standard authentication
2. **Persistent Failure**: Continuous authentication failures
3. **First Click Invalid Token**: Invalid token on first attempt
4. **Network Timeout**: Simulated network delays

### Connection Scenarios

1. **Normal Operation**: Standard load with healthy connections
2. **Low Traffic**: Minimal load with optimal performance
3. **High Traffic**: Elevated load with some degradation
4. **Server Overload**: High load with queuing and polling
5. **Critical Overload**: Maximum load with severe issues
6. **Connection Limit Test**: Test connection limits and queuing
7. **Inactivity Timeout Test**: Test automatic disconnection
8. **Polling Mode Test**: Test HTTP polling fallback
9. **Rate Limiting Test**: Test connection throttling
10. **Priority Queuing Test**: Test priority-based queuing

## Features

### Connection Management Simulator

-   **Load Level Simulation**: Simulate different server load levels
-   **Real-time Metrics**: Monitor connection health in real-time
-   **Manual Controls**: Manually trigger connection events
-   **Configuration Management**: Dynamically adjust settings
-   **Health Monitoring**: Track connection health status
-   **Recommendations**: Get load reduction suggestions
-   **Polling Mode**: Test HTTP polling fallback
-   **Queue Management**: Monitor connection queuing

### Metrics Tracked

-   Active connections
-   Connection ratio
-   Failure rate
-   Average response time
-   Queue length
-   Health status
-   Polling mode status

### Health Status Levels

-   **Healthy**: Normal operation (0-70% connections)
-   **Degraded**: Performance issues (70-90% connections)
-   **Overloaded**: Severe issues (90-100% connections)

## Integration

### With Existing Simulator

The connection management simulator integrates seamlessly with the existing SSO simulator:

```typescript
// Combined usage
const ssoSimulator = useSSOSimulator();
const connectionSimulator = useConnectionSimulator();

// Test SSO failure during high load
ssoSimulator.toggleFailure();
connectionSimulator.simulateLoadLevel('overloaded');
```

### With Game Components

The simulator affects the actual connection management system:

```typescript
// The simulator updates the real connection configuration
connectionSimulator.updateConfiguration({
    maxConnections: 500,
    inactivityTimeout: 2 * 60 * 1000,
});

// This affects all game components using the connection system
```

## Testing

### Manual Testing

1. Open the connection simulator UI
2. Select a predefined scenario
3. Start the simulation
4. Monitor real-time metrics
5. Test manual controls
6. Verify system behavior

### Automated Testing

```typescript
// Test connection limits
test('should limit connections when overloaded', () => {
    const simulator = useConnectionSimulator();
    simulator.simulateLoadLevel('overloaded');

    expect(simulator.getHealthStatus()).toBe('overloaded');
    expect(simulator.connectionQueueLength).toBeGreaterThan(0);
});

// Test polling mode
test('should enable polling mode when overloaded', () => {
    const simulator = useConnectionSimulator();
    simulator.simulateLoadLevel('critical');

    expect(simulator.pollingModeEnabled).toBe(true);
});
```

## Configuration

### Environment Variables

```bash
# Enable debug logging
CONNECTION_DEBUG=true

# Set default configuration
CONNECTION_MAX_CONNECTIONS=1000
CONNECTION_INACTIVITY_TIMEOUT=300000
```

### Dynamic Configuration

```typescript
// Update configuration at runtime
connectionSimulator.updateConfiguration({
    maxConnections: 1500,
    inactivityTimeout: 10 * 60 * 1000,
});
```

## Troubleshooting

### Common Issues

1. **Simulator not responding**: Check if simulation is active
2. **Metrics not updating**: Verify health service is running
3. **Configuration not applying**: Check type compatibility
4. **UI not showing**: Ensure showControls is true

### Debug Mode

Enable debug logging to see detailed information:

```typescript
// Add to your environment
process.env.CONNECTION_DEBUG = 'true';
```

## Best Practices

1. **Start with predefined scenarios**: Use existing scenarios before creating custom ones
2. **Monitor metrics**: Keep an eye on real-time metrics during testing
3. **Test edge cases**: Try extreme load levels and failure scenarios
4. **Reset after testing**: Always reset the simulator after testing
5. **Document custom scenarios**: Document any custom scenarios you create

## Future Enhancements

1. **Machine Learning Integration**: Predictive load management
2. **Geographic Distribution**: Multi-region load testing
3. **Advanced Analytics**: Detailed performance analytics
4. **Auto-scaling Tests**: Test automatic scaling behavior
5. **Integration Testing**: End-to-end scenario testing
