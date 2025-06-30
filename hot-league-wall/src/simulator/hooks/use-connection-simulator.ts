import { useState, useCallback, useEffect } from 'react';
import { ConnectionSimulatorState, ConnectionScenario, ConnectionLoadLevel } from '../types';
import { ConnectionHealthService } from '../../games/game-base/services/connection-health-service';
import { DynamicConnectionConfig } from '../../games/game-base/config/connection-config';

/**
 * Custom Hook for Connection Management Simulation
 * 
 * Single Responsibility: Manages connection simulation state and logic
 * Open/Closed: Extensible through composition
 * Interface Segregation: Provides specific connection simulation interface
 */
export const useConnectionSimulator = (initialState: Partial<ConnectionSimulatorState> = {}) => {
    const [state, setState] = useState<ConnectionSimulatorState>({
        showControls: false,
        isSimulationActive: false,
        currentLoadLevel: 'normal',
        simulatedConnections: 0,
        maxConnections: 1000,
        inactivityTimeout: 5 * 60 * 1000,
        pollingModeEnabled: false,
        connectionQueueLength: 0,
        failureRate: 0,
        responseTimeDelay: 0,
        ...initialState
    });

    const healthService = ConnectionHealthService.getInstance();
    const configService = DynamicConnectionConfig.getInstance();

    /**
     * Simulate different load levels
     */
    const simulateLoadLevel = useCallback((loadLevel: ConnectionLoadLevel) => {
        setState(prev => {
            let newConnections = 0;
            let newFailureRate = 0;
            let newResponseTimeDelay = 0;
            let newPollingMode = false;

            switch (loadLevel) {
                case 'low':
                    newConnections = Math.floor(state.maxConnections * 0.3);
                    newFailureRate = 2;
                    newResponseTimeDelay = 100;
                    break;
                case 'normal':
                    newConnections = Math.floor(state.maxConnections * 0.6);
                    newFailureRate = 5;
                    newResponseTimeDelay = 200;
                    break;
                case 'high':
                    newConnections = Math.floor(state.maxConnections * 0.8);
                    newFailureRate = 10;
                    newResponseTimeDelay = 500;
                    break;
                case 'overloaded':
                    newConnections = Math.floor(state.maxConnections * 0.95);
                    newFailureRate = 25;
                    newResponseTimeDelay = 2000;
                    newPollingMode = true;
                    break;
                case 'critical':
                    newConnections = state.maxConnections;
                    newFailureRate = 50;
                    newResponseTimeDelay = 5000;
                    newPollingMode = true;
                    break;
            }

            return {
                ...prev,
                currentLoadLevel: loadLevel,
                simulatedConnections: newConnections,
                failureRate: newFailureRate,
                responseTimeDelay: newResponseTimeDelay,
                pollingModeEnabled: newPollingMode,
                connectionQueueLength: loadLevel === 'overloaded' || loadLevel === 'critical' ? Math.floor(Math.random() * 100) + 50 : 0
            };
        });
    }, [state.maxConnections]);

    /**
     * Toggle simulation on/off
     */
    const toggleSimulation = useCallback(() => {
        setState(prev => {
            const newSimulationActive = !prev.isSimulationActive;

            if (!newSimulationActive) {
                // Reset to normal when turning off simulation
                healthService.resetMetrics();
                configService.resetToDefault();
            }

            return {
                ...prev,
                isSimulationActive: newSimulationActive
            };
        });
    }, [healthService, configService]);

    /**
     * Toggle controls visibility
     */
    const toggleControls = useCallback(() => {
        setState(prev => ({
            ...prev,
            showControls: !prev.showControls
        }));
    }, []);

    /**
     * Simulate connection attempts
     */
    const simulateConnectionAttempts = useCallback((count: number) => {
        if (!state.isSimulationActive) return;

        for (let i = 0; i < count; i++) {
            const isSuccess = Math.random() * 100 > state.failureRate;
            const responseTime = state.responseTimeDelay + Math.random() * 1000;

            healthService.recordConnectionAttempt(isSuccess, responseTime);
        }
    }, [state.isSimulationActive, state.failureRate, state.responseTimeDelay, healthService]);

    /**
     * Simulate connection closures
     */
    const simulateConnectionClosures = useCallback((count: number) => {
        if (!state.isSimulationActive) return;

        for (let i = 0; i < count; i++) {
            healthService.recordConnectionClosure();
        }
    }, [state.isSimulationActive, healthService]);

    /**
     * Update configuration dynamically
     */
    const updateConfiguration = useCallback((updates: Partial<ConnectionSimulatorState>) => {
        setState(prev => ({
            ...prev,
            ...updates
        }));

        // Update the actual configuration service with proper type mapping
        const configUpdates: any = {};

        if (updates.maxConnections !== undefined) {
            configUpdates.MAX_CONNECTIONS = updates.maxConnections;
        }

        if (updates.inactivityTimeout !== undefined) {
            configUpdates.INACTIVITY_TIMEOUT = updates.inactivityTimeout;
        }

        if (Object.keys(configUpdates).length > 0) {
            configService.updateConfig(configUpdates);
        }
    }, [configService]);

    /**
     * Select a predefined scenario
     */
    const selectScenario = useCallback((scenario: ConnectionScenario) => {
        setState(prev => ({
            ...prev,
            ...scenario.settings
        }));

        // Apply scenario settings to actual services with proper type mapping
        const configUpdates: any = {};

        if (scenario.settings.maxConnections !== undefined) {
            configUpdates.MAX_CONNECTIONS = scenario.settings.maxConnections;
        }

        if (scenario.settings.inactivityTimeout !== undefined) {
            configUpdates.INACTIVITY_TIMEOUT = scenario.settings.inactivityTimeout;
        }

        if (Object.keys(configUpdates).length > 0) {
            configService.updateConfig(configUpdates);
        }

        simulateLoadLevel(scenario.loadLevel);
    }, [simulateLoadLevel, configService]);

    /**
     * Generate random connection activity
     */
    const generateRandomActivity = useCallback(() => {
        if (!state.isSimulationActive) return;

        const interval = setInterval(() => {
            // Simulate random connection attempts
            const attempts = Math.floor(Math.random() * 10) + 1;
            simulateConnectionAttempts(attempts);

            // Simulate random connection closures
            const closures = Math.floor(Math.random() * 5) + 1;
            simulateConnectionClosures(closures);

            // Update queue length randomly
            if (state.currentLoadLevel === 'overloaded' || state.currentLoadLevel === 'critical') {
                setState(prev => ({
                    ...prev,
                    connectionQueueLength: Math.max(0, prev.connectionQueueLength + Math.floor(Math.random() * 10) - 5)
                }));
            }
        }, 2000); // Every 2 seconds

        return () => clearInterval(interval);
    }, [state.isSimulationActive, state.currentLoadLevel, state.connectionQueueLength, simulateConnectionAttempts, simulateConnectionClosures]);

    /**
     * Get current health metrics
     */
    const getHealthMetrics = useCallback(() => {
        return healthService.getMetrics();
    }, [healthService]);

    /**
     * Get health status
     */
    const getHealthStatus = useCallback(() => {
        return healthService.getHealthStatus();
    }, [healthService]);

    /**
     * Get load reduction recommendations
     */
    const getRecommendations = useCallback(() => {
        return healthService.getLoadReductionRecommendations();
    }, [healthService]);

    /**
     * Reset simulation
     */
    const resetSimulation = useCallback(() => {
        setState(prev => ({
            ...prev,
            isSimulationActive: false,
            currentLoadLevel: 'normal',
            simulatedConnections: 0,
            failureRate: 0,
            responseTimeDelay: 0,
            pollingModeEnabled: false,
            connectionQueueLength: 0
        }));

        healthService.resetMetrics();
        configService.resetToDefault();
    }, [healthService, configService]);

    /**
     * Reset connection simulator state after successful SSO retry
     * This method can be called from external components to reset the simulator
     * when authentication is restored
     */
    const resetAfterSSORetry = useCallback(() => {
        console.log('🔄 [ConnectionSimulator] Resetting after successful SSO retry');

        // Reset to normal load level
        setState(prev => ({
            ...prev,
            currentLoadLevel: 'normal',
            failureRate: 5, // Normal failure rate
            responseTimeDelay: 200, // Normal response time
            pollingModeEnabled: false,
            connectionQueueLength: 0
        }));

        // Reset health service metrics
        healthService.resetMetrics();

        // Reset configuration to default
        configService.resetToDefault();

        console.log('🔄 [ConnectionSimulator] Reset completed - returning to normal operation');
    }, [healthService, configService]);

    // Auto-generate activity when simulation is active
    useEffect(() => {
        if (state.isSimulationActive) {
            const cleanup = generateRandomActivity();
            return cleanup;
        }
    }, [state.isSimulationActive, generateRandomActivity]);

    // Listen for SSO retry success events
    useEffect(() => {
        const handleSSORetrySuccess = () => {
            console.log('🔄 [ConnectionSimulator] Received SSO retry success event');
            resetAfterSSORetry();
        };

        // Listen for custom event
        window.addEventListener('sso-retry-success', handleSSORetrySuccess);

        return () => {
            window.removeEventListener('sso-retry-success', handleSSORetrySuccess);
        };
    }, [resetAfterSSORetry]);

    return {
        // State
        ...state,

        // Actions
        toggleSimulation,
        toggleControls,
        simulateLoadLevel,
        simulateConnectionAttempts,
        simulateConnectionClosures,
        updateConfiguration,
        selectScenario,
        resetSimulation,
        resetAfterSSORetry,

        // Computed values
        getHealthMetrics,
        getHealthStatus,
        getRecommendations,

        // Utility functions
        isOverloaded: state.currentLoadLevel === 'overloaded' || state.currentLoadLevel === 'critical',
        isDegraded: state.currentLoadLevel === 'high',
        isHealthy: state.currentLoadLevel === 'low' || state.currentLoadLevel === 'normal'
    };
}; 