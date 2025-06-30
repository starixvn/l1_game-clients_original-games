/**
 * Connection Management Configuration
 * 
 * This file contains all the configuration settings for connection management
 * to help reduce server load during high traffic periods.
 */

export const CONNECTION_CONFIG = {
    // Maximum number of concurrent WebSocket connections
    MAX_CONNECTIONS: 1000,

    // Inactivity timeout before disconnecting idle users (in milliseconds)
    INACTIVITY_TIMEOUT: 5 * 60 * 1000, // 5 minutes

    // Maximum connection attempts per user per minute
    MAX_ATTEMPTS_PER_MINUTE: 3,

    // Polling interval when WebSocket is unavailable (in milliseconds)
    POLLING_INTERVAL: 5000, // 5 seconds

    // Heartbeat interval to keep connections alive (in milliseconds)
    HEARTBEAT_INTERVAL: 30000, // 30 seconds

    // Service health check interval (in milliseconds)
    SERVICE_HEALTH_CHECK_INTERVAL: 60000, // 1 minute

    // Connection queue processing delay (in milliseconds)
    QUEUE_PROCESSING_DELAY: 1000, // 1 second

    // Health status thresholds
    HEALTH_THRESHOLDS: {
        OVERLOADED: 0.9, // 90% of max connections
        DEGRADED: 0.7,   // 70% of max connections
    },

    // Priority levels for connection queuing
    PRIORITY_LEVELS: {
        ACTIVE_BETTING: 1,
        VIEWING_STATS: 2,
        IDLE_USER: 3,
    },

    // API endpoints for polling fallback
    API_ENDPOINTS: {
        GAME_UPDATES: '/api/game/{namespace}/updates',
        HEALTH_CHECK: '/api/health',
    },
} as const;

/**
 * Environment-specific configuration overrides
 */
export const getConnectionConfig = () => {
    const env = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'staging' | 'test';

    switch (env) {
        case 'production':
            return {
                ...CONNECTION_CONFIG,
                MAX_CONNECTIONS: 2000, // Higher limit for production
                INACTIVITY_TIMEOUT: 10 * 60 * 1000, // 10 minutes for production
            };
        case 'staging':
            return {
                ...CONNECTION_CONFIG,
                MAX_CONNECTIONS: 500, // Lower limit for staging
                INACTIVITY_TIMEOUT: 3 * 60 * 1000, // 3 minutes for staging
            };
        default:
            return CONNECTION_CONFIG;
    }
};

/**
 * Dynamic configuration that can be updated at runtime
 */
export class DynamicConnectionConfig {
    private static instance: DynamicConnectionConfig;
    private config: typeof CONNECTION_CONFIG;

    private constructor() {
        this.config = { ...CONNECTION_CONFIG };
    }

    static getInstance(): DynamicConnectionConfig {
        if (!DynamicConnectionConfig.instance) {
            DynamicConnectionConfig.instance = new DynamicConnectionConfig();
        }
        return DynamicConnectionConfig.instance;
    }

    getConfig(): typeof CONNECTION_CONFIG {
        return { ...this.config };
    }

    updateConfig(updates: Partial<typeof CONNECTION_CONFIG>): void {
        this.config = { ...this.config, ...updates };
        console.log('🔗 [DynamicConnectionConfig] Configuration updated:', updates);
    }

    resetToDefault(): void {
        this.config = { ...CONNECTION_CONFIG };
        console.log('🔗 [DynamicConnectionConfig] Configuration reset to default');
    }
} 