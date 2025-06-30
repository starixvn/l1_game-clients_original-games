import { ConnectionScenario, ConnectionLoadLevel } from './types';

/**
 * Predefined connection scenarios for testing different load conditions
 */
export const CONNECTION_SCENARIOS: ConnectionScenario[] = [
    {
        id: 'normal-operation',
        name: 'Normal Operation',
        description: 'Standard load with healthy connection management',
        loadLevel: 'normal',
        settings: {
            maxConnections: 1000,
            inactivityTimeout: 5 * 60 * 1000,
            failureRate: 5,
            responseTimeDelay: 200,
            pollingModeEnabled: false,
            connectionQueueLength: 0
        }
    },
    {
        id: 'low-traffic',
        name: 'Low Traffic',
        description: 'Minimal load with optimal performance',
        loadLevel: 'low',
        settings: {
            maxConnections: 1000,
            inactivityTimeout: 10 * 60 * 1000,
            failureRate: 2,
            responseTimeDelay: 100,
            pollingModeEnabled: false,
            connectionQueueLength: 0
        }
    },
    {
        id: 'high-traffic',
        name: 'High Traffic',
        description: 'Elevated load with some performance degradation',
        loadLevel: 'high',
        settings: {
            maxConnections: 1000,
            inactivityTimeout: 3 * 60 * 1000,
            failureRate: 10,
            responseTimeDelay: 500,
            pollingModeEnabled: false,
            connectionQueueLength: 10
        }
    },
    {
        id: 'server-overload',
        name: 'Server Overload',
        description: 'High load with connection queuing and polling fallback',
        loadLevel: 'overloaded',
        settings: {
            maxConnections: 1000,
            inactivityTimeout: 2 * 60 * 1000,
            failureRate: 25,
            responseTimeDelay: 2000,
            pollingModeEnabled: true,
            connectionQueueLength: 75
        }
    },
    {
        id: 'critical-overload',
        name: 'Critical Overload',
        description: 'Maximum load with severe performance issues',
        loadLevel: 'critical',
        settings: {
            maxConnections: 1000,
            inactivityTimeout: 1 * 60 * 1000,
            failureRate: 50,
            responseTimeDelay: 5000,
            pollingModeEnabled: true,
            connectionQueueLength: 150
        }
    },
    {
        id: 'connection-limit-test',
        name: 'Connection Limit Test',
        description: 'Test connection limits and queuing behavior',
        loadLevel: 'overloaded',
        settings: {
            maxConnections: 500,
            inactivityTimeout: 2 * 60 * 1000,
            failureRate: 15,
            responseTimeDelay: 1000,
            pollingModeEnabled: true,
            connectionQueueLength: 100
        }
    },
    {
        id: 'inactivity-timeout-test',
        name: 'Inactivity Timeout Test',
        description: 'Test automatic disconnection of idle users',
        loadLevel: 'normal',
        settings: {
            maxConnections: 1000,
            inactivityTimeout: 30 * 1000, // 30 seconds for testing
            failureRate: 5,
            responseTimeDelay: 200,
            pollingModeEnabled: false,
            connectionQueueLength: 0
        }
    },
    {
        id: 'polling-mode-test',
        name: 'Polling Mode Test',
        description: 'Test HTTP polling fallback when WebSocket is unavailable',
        loadLevel: 'overloaded',
        settings: {
            maxConnections: 1000,
            inactivityTimeout: 5 * 60 * 1000,
            failureRate: 30,
            responseTimeDelay: 3000,
            pollingModeEnabled: true,
            connectionQueueLength: 50
        }
    },
    {
        id: 'rate-limiting-test',
        name: 'Rate Limiting Test',
        description: 'Test connection throttling and rate limiting',
        loadLevel: 'high',
        settings: {
            maxConnections: 1000,
            inactivityTimeout: 5 * 60 * 1000,
            failureRate: 20,
            responseTimeDelay: 1000,
            pollingModeEnabled: false,
            connectionQueueLength: 25
        }
    },
    {
        id: 'priority-queuing-test',
        name: 'Priority Queuing Test',
        description: 'Test priority-based connection queuing',
        loadLevel: 'overloaded',
        settings: {
            maxConnections: 800,
            inactivityTimeout: 3 * 60 * 1000,
            failureRate: 15,
            responseTimeDelay: 1500,
            pollingModeEnabled: true,
            connectionQueueLength: 120
        }
    }
];

/**
 * Get scenario by ID
 */
export const getConnectionScenario = (id: string): ConnectionScenario | undefined => {
    return CONNECTION_SCENARIOS.find(scenario => scenario.id === id);
};

/**
 * Get scenarios by load level
 */
export const getConnectionScenariosByLoadLevel = (loadLevel: ConnectionLoadLevel): ConnectionScenario[] => {
    return CONNECTION_SCENARIOS.filter(scenario => scenario.loadLevel === loadLevel);
};

/**
 * Get all load levels
 */
export const getConnectionLoadLevels = (): ConnectionLoadLevel[] => {
    return ['low', 'normal', 'high', 'overloaded', 'critical'];
};

/**
 * Get scenario descriptions for UI
 */
export const getConnectionScenarioDescriptions = () => {
    return CONNECTION_SCENARIOS.map(scenario => ({
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        loadLevel: scenario.loadLevel
    }));
}; 