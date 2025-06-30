import { CONNECTION_CONFIG } from '../config/connection-config';

/**
 * Connection Health Service
 * 
 * Monitors connection health and provides metrics for server load management
 */
export class ConnectionHealthService {
    private static instance: ConnectionHealthService;
    private metrics: {
        totalConnections: number;
        activeConnections: number;
        failedConnections: number;
        averageResponseTime: number;
        lastHealthCheck: number;
        connectionHistory: Array<{
            timestamp: number;
            activeConnections: number;
            failedConnections: number;
        }>;
    };

    private constructor() {
        this.metrics = {
            totalConnections: 0,
            activeConnections: 0,
            failedConnections: 0,
            averageResponseTime: 0,
            lastHealthCheck: Date.now(),
            connectionHistory: [],
        };
    }

    static getInstance(): ConnectionHealthService {
        if (!ConnectionHealthService.instance) {
            ConnectionHealthService.instance = new ConnectionHealthService();
        }
        return ConnectionHealthService.instance;
    }

    /**
     * Record a new connection attempt
     */
    recordConnectionAttempt(success: boolean, responseTime?: number): void {
        this.metrics.totalConnections++;

        if (success) {
            this.metrics.activeConnections++;
        } else {
            this.metrics.failedConnections++;
        }

        if (responseTime !== undefined) {
            this.updateAverageResponseTime(responseTime);
        }

        this.updateConnectionHistory();
    }

    /**
     * Record a connection closure
     */
    recordConnectionClosure(): void {
        this.metrics.activeConnections = Math.max(0, this.metrics.activeConnections - 1);
        this.updateConnectionHistory();
    }

    /**
     * Get current health status
     */
    getHealthStatus(): 'healthy' | 'degraded' | 'overloaded' {
        const connectionRatio = this.metrics.activeConnections / CONNECTION_CONFIG.MAX_CONNECTIONS;

        if (connectionRatio > CONNECTION_CONFIG.HEALTH_THRESHOLDS.OVERLOADED) {
            return 'overloaded';
        } else if (connectionRatio > CONNECTION_CONFIG.HEALTH_THRESHOLDS.DEGRADED) {
            return 'degraded';
        } else {
            return 'healthy';
        }
    }

    /**
     * Get connection metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            healthStatus: this.getHealthStatus(),
            connectionRatio: this.metrics.activeConnections / CONNECTION_CONFIG.MAX_CONNECTIONS,
            failureRate: this.metrics.totalConnections > 0
                ? (this.metrics.failedConnections / this.metrics.totalConnections) * 100
                : 0,
        };
    }

    /**
     * Get connection history for the last hour
     */
    getConnectionHistory(hours: number = 1): Array<{ timestamp: number; activeConnections: number; failedConnections: number }> {
        const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
        return this.metrics.connectionHistory.filter(entry => entry.timestamp > cutoffTime);
    }

    /**
     * Check if the service is under stress
     */
    isUnderStress(): boolean {
        const healthStatus = this.getHealthStatus();
        const failureRate = this.getMetrics().failureRate;

        return healthStatus === 'overloaded' || failureRate > 10; // 10% failure rate threshold
    }

    /**
     * Get recommendations for load reduction
     */
    getLoadReductionRecommendations(): string[] {
        const recommendations: string[] = [];
        const metrics = this.getMetrics();

        if (metrics.connectionRatio > 0.8) {
            recommendations.push('Consider reducing connection timeout to free up connections faster');
        }

        if (metrics.failureRate > 5) {
            recommendations.push('High failure rate detected - check server resources and network connectivity');
        }

        if (metrics.averageResponseTime > 1000) {
            recommendations.push('High response time detected - consider enabling polling mode for idle users');
        }

        if (this.metrics.activeConnections > CONNECTION_CONFIG.MAX_CONNECTIONS * 0.9) {
            recommendations.push('Near connection limit - consider implementing connection queuing');
        }

        return recommendations;
    }

    /**
     * Reset metrics (useful for testing or after maintenance)
     */
    resetMetrics(): void {
        this.metrics = {
            totalConnections: 0,
            activeConnections: 0,
            failedConnections: 0,
            averageResponseTime: 0,
            lastHealthCheck: Date.now(),
            connectionHistory: [],
        };
        console.log('🔗 [ConnectionHealthService] Metrics reset');
    }

    private updateAverageResponseTime(newResponseTime: number): void {
        const totalConnections = this.metrics.totalConnections;
        this.metrics.averageResponseTime =
            (this.metrics.averageResponseTime * (totalConnections - 1) + newResponseTime) / totalConnections;
    }

    private updateConnectionHistory(): void {
        const now = Date.now();

        // Add new entry
        this.metrics.connectionHistory.push({
            timestamp: now,
            activeConnections: this.metrics.activeConnections,
            failedConnections: this.metrics.failedConnections,
        });

        // Keep only last 24 hours of history (1440 entries at 1-minute intervals)
        const maxHistoryLength = 1440;
        if (this.metrics.connectionHistory.length > maxHistoryLength) {
            this.metrics.connectionHistory = this.metrics.connectionHistory.slice(-maxHistoryLength);
        }

        this.metrics.lastHealthCheck = now;
    }
}

/**
 * Utility functions for connection health monitoring
 */
export const ConnectionHealthUtils = {
    /**
     * Format connection metrics for logging
     */
    formatMetrics(metrics: ReturnType<ConnectionHealthService['getMetrics']>): string {
        return `Connections: ${metrics.activeConnections}/${CONNECTION_CONFIG.MAX_CONNECTIONS} ` +
            `(${(metrics.connectionRatio * 100).toFixed(1)}%) | ` +
            `Health: ${metrics.healthStatus} | ` +
            `Failure Rate: ${metrics.failureRate.toFixed(1)}% | ` +
            `Avg Response: ${metrics.averageResponseTime.toFixed(0)}ms`;
    },

    /**
     * Check if immediate action is needed
     */
    needsImmediateAction(healthService: ConnectionHealthService): boolean {
        const metrics = healthService.getMetrics();
        return metrics.connectionRatio > 0.95 || metrics.failureRate > 20;
    },

    /**
     * Get suggested polling interval based on server load
     */
    getSuggestedPollingInterval(healthService: ConnectionHealthService): number {
        const healthStatus = healthService.getHealthStatus();

        switch (healthStatus) {
            case 'overloaded':
                return CONNECTION_CONFIG.POLLING_INTERVAL * 2; // Double the interval
            case 'degraded':
                return CONNECTION_CONFIG.POLLING_INTERVAL * 1.5; // 1.5x the interval
            default:
                return CONNECTION_CONFIG.POLLING_INTERVAL;
        }
    },
}; 