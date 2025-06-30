# Connection Management Simulator - Usage Guide

## Quick Start

### 1. Basic Integration

Replace your existing App import with the simulator-enabled version:

```tsx
// Instead of:
import App from './app';

// Use:
import AppWithSimulator from './app-with-simulator';

// In your main component:
<AppWithSimulator appEnv="development" language="en" siteId="test" enableSimulators={true} onRequestSSOToken={yourTokenFunction} />;
```

### 2. Manual Integration

If you want to add simulators to your existing app:

```tsx
import { ConnectionControlSimulatorWrapper, useConnectionSimulator } from './simulator';
import { useSSOSimulator } from './_shared/components/sso-control-simulator';

const YourApp = () => {
    const connectionSimulator = useConnectionSimulator();
    const ssoSimulator = useSSOSimulator();

    return (
        <ConnectionControlSimulatorWrapper showToggleButton={true}>
            {/* Your existing app content */}
            <YourExistingAppContent />
        </ConnectionControlSimulatorWrapper>
    );
};
```

## Testing Scenarios

### 1. Connection Load Testing

```tsx
// Simulate high load
connectionSimulator.simulateLoadLevel('high');

// Simulate extreme load
connectionSimulator.simulateLoadLevel('extreme');

// Return to normal
connectionSimulator.simulateLoadLevel('normal');
```

### 2. Connection Limits Testing

```tsx
// Set low connection limit
connectionSimulator.setConnectionLimit(5);

// Set high connection limit
connectionSimulator.setConnectionLimit(50);

// Reset to default
connectionSimulator.resetConnectionLimit();
```

### 3. Throttling Testing

```tsx
// Enable aggressive throttling
connectionSimulator.setThrottlingLevel('aggressive');

// Enable moderate throttling
connectionSimulator.setThrottlingLevel('moderate');

// Disable throttling
connectionSimulator.setThrottlingLevel('none');
```

### 4. Inactivity Timeout Testing

```tsx
// Set short inactivity timeout
connectionSimulator.setInactivityTimeout(30000); // 30 seconds

// Set long inactivity timeout
connectionSimulator.setInactivityTimeout(300000); // 5 minutes

// Reset to default
connectionSimulator.resetInactivityTimeout();
```

### 5. Polling Fallback Testing

```tsx
// Enable polling fallback
connectionSimulator.enablePollingFallback(true);

// Disable polling fallback
connectionSimulator.enablePollingFallback(false);
```

### 6. Priority Queue Testing

```tsx
// Enable priority queuing
connectionSimulator.enablePriorityQueuing(true);

// Disable priority queuing
connectionSimulator.enablePriorityQueuing(false);
```

## UI Controls

The simulator provides a floating control panel with:

### Connection Metrics

-   **Active Connections**: Real-time count of active connections
-   **Connection Limit**: Current connection limit setting
-   **Queue Length**: Number of connections waiting in queue
-   **Throttle Level**: Current throttling intensity
-   **Polling Active**: Whether HTTP polling fallback is active

### Load Simulation

-   **Load Level**: Dropdown to select load scenarios (normal, high, extreme)
-   **Connection Limit**: Slider to adjust connection limits
-   **Throttling**: Dropdown to select throttling levels

### Manual Controls

-   **Force Disconnect**: Button to simulate connection drops
-   **Enable/Disable Polling**: Toggle for HTTP polling fallback
-   **Reset All**: Button to reset all settings to defaults

## Real-time Monitoring

### Console Logs

The simulator provides detailed console logging:

```
🔗 [CONNECTION_SIMULATOR] Load level changed to: high
🔗 [CONNECTION_SIMULATOR] Connection limit set to: 10
🔗 [CONNECTION_SIMULATOR] Throttling enabled: moderate
🔗 [CONNECTION_SIMULATOR] Polling fallback activated
🔗 [CONNECTION_SIMULATOR] Connection queued due to limit
```

### Performance Metrics

Monitor these metrics in the browser's Performance tab:

-   WebSocket connection count
-   Memory usage
-   CPU usage
-   Network activity

## Testing Workflows

### 1. Load Testing Workflow

```tsx
// 1. Start with normal load
connectionSimulator.simulateLoadLevel('normal');

// 2. Gradually increase load
connectionSimulator.simulateLoadLevel('high');

// 3. Test extreme conditions
connectionSimulator.simulateLoadLevel('extreme');

// 4. Monitor performance degradation
// 5. Test recovery when returning to normal
connectionSimulator.simulateLoadLevel('normal');
```

### 2. Connection Limit Testing Workflow

```tsx
// 1. Set low connection limit
connectionSimulator.setConnectionLimit(5);

// 2. Attempt to create multiple connections
// 3. Observe queuing behavior
// 4. Test connection prioritization
connectionSimulator.enablePriorityQueuing(true);

// 5. Monitor queue length in UI
// 6. Test queue processing
```

### 3. Failure Recovery Testing Workflow

```tsx
// 1. Enable polling fallback
connectionSimulator.enablePollingFallback(true);

// 2. Simulate WebSocket failures
connectionSimulator.forceDisconnect();

// 3. Observe fallback to HTTP polling
// 4. Test reconnection attempts
// 5. Verify graceful degradation
```

## Browser Developer Tools

### Network Tab

-   Monitor WebSocket connections
-   Check HTTP polling requests
-   Verify connection limits

### Performance Tab

-   Record performance during load tests
-   Monitor memory usage
-   Check for memory leaks

### Console Tab

-   View simulator logs
-   Monitor connection events
-   Debug connection issues

## Common Testing Scenarios

### Scenario 1: High Traffic Period

```tsx
// Simulate peak usage
connectionSimulator.simulateLoadLevel('high');
connectionSimulator.setConnectionLimit(20);
connectionSimulator.setThrottlingLevel('moderate');

// Test for 5 minutes
setTimeout(() => {
    connectionSimulator.simulateLoadLevel('normal');
}, 300000);
```

### Scenario 2: Server Overload

```tsx
// Simulate server issues
connectionSimulator.simulateLoadLevel('extreme');
connectionSimulator.setConnectionLimit(5);
connectionSimulator.enablePollingFallback(true);

// Force some disconnections
setInterval(() => {
    connectionSimulator.forceDisconnect();
}, 10000);
```

### Scenario 3: Network Instability

```tsx
// Simulate poor network conditions
connectionSimulator.setThrottlingLevel('aggressive');
connectionSimulator.setInactivityTimeout(60000);

// Random disconnections
setInterval(() => {
    if (Math.random() > 0.7) {
        connectionSimulator.forceDisconnect();
    }
}, 5000);
```

## Troubleshooting

### Simulator Not Appearing

-   Check that `enableSimulators={true}`
-   Verify `ConnectionControlSimulatorWrapper` is wrapping your app
-   Check console for import errors

### Controls Not Working

-   Ensure hooks are properly initialized
-   Check for TypeScript errors
-   Verify simulator state is being updated

### Performance Issues

-   Reduce connection limits during testing
-   Use browser dev tools to monitor resources
-   Consider testing in incognito mode

## Integration with Existing Tests

### Jest Tests

```tsx
import { useConnectionSimulator } from './simulator';

test('connection management under high load', () => {
    const { result } = renderHook(() => useConnectionSimulator());

    act(() => {
        result.current.simulateLoadLevel('high');
    });

    expect(result.current.state.loadLevel).toBe('high');
});
```

### E2E Tests

```tsx
// In your E2E test
await page.click('[data-testid="simulator-toggle"]');
await page.selectOption('[data-testid="load-level-select"]', 'high');
await page.waitForSelector('[data-testid="active-connections"]');
const connections = await page.textContent('[data-testid="active-connections"]');
expect(parseInt(connections)).toBeLessThanOrEqual(20);
```

This comprehensive guide should help you effectively test and validate your connection management system using the simulator.
