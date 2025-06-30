import React, { useState, useEffect } from 'react';
import { useConnectionSimulator } from '../hooks/use-connection-simulator';
import { CONNECTION_SCENARIOS, getConnectionLoadLevels } from '../connection-scenarios';
import { ConnectionLoadLevel, ConnectionMetrics } from '../types';
import { ConnectionHealthUtils } from '../../games/game-base/services/connection-health-service';
import './connection-control-simulator.scss';

interface ConnectionControlSimulatorProps {
    showControls?: boolean;
    onToggleControls?: () => void;
}

export const ConnectionControlSimulator: React.FC<ConnectionControlSimulatorProps> = ({
    showControls = false,
    onToggleControls
}) => {
    const connectionSimulator = useConnectionSimulator();
    const [selectedScenario, setSelectedScenario] = useState<string>('');
    const [metrics, setMetrics] = useState<ConnectionMetrics>({
        totalConnections: 0,
        activeConnections: 0,
        failedConnections: 0,
        averageResponseTime: 0,
        healthStatus: 'healthy',
        connectionRatio: 0,
        failureRate: 0
    });

    // Collapsible state
    const [collapsed, setCollapsed] = useState(false);

    // Update metrics every second when simulation is active
    useEffect(() => {
        if (!connectionSimulator.isSimulationActive) return;

        const interval = setInterval(() => {
            const currentMetrics = connectionSimulator.getHealthMetrics();
            setMetrics({
                totalConnections: currentMetrics.totalConnections,
                activeConnections: currentMetrics.activeConnections,
                failedConnections: currentMetrics.failedConnections,
                averageResponseTime: currentMetrics.averageResponseTime,
                healthStatus: currentMetrics.healthStatus,
                connectionRatio: currentMetrics.connectionRatio,
                failureRate: currentMetrics.failureRate
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [connectionSimulator.isSimulationActive, connectionSimulator.getHealthMetrics]);

    const handleScenarioSelect = (scenarioId: string) => {
        const scenario = CONNECTION_SCENARIOS.find(s => s.id === scenarioId);
        if (scenario) {
            setSelectedScenario(scenarioId);
            connectionSimulator.selectScenario(scenario);
        }
    };

    const handleLoadLevelChange = (loadLevel: ConnectionLoadLevel) => {
        connectionSimulator.simulateLoadLevel(loadLevel);
    };

    const handleManualConnectionAttempts = (count: number) => {
        connectionSimulator.simulateConnectionAttempts(count);
    };

    const handleManualConnectionClosures = (count: number) => {
        connectionSimulator.simulateConnectionClosures(count);
    };

    if (!showControls) return null;

    return (
        <div className={`connection-sim-root${collapsed ? ' collapsed' : ''}`}>
            <div className="connection-sim-header">
                <div className="connection-sim-title">
                    🔗 Connection Management Simulator
                    <button
                        className="connection-sim-toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? 'Expand' : 'Collapse'}
                    >
                        {collapsed ? '▲' : '▼'}
                    </button>
                </div>
                {onToggleControls && (
                    <button
                        className="connection-sim-close"
                        onClick={onToggleControls}
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}
            </div>
            {!collapsed && (
                <div className="connection-sim-content">
                    {/* Simulation Controls */}
                    <div className="connection-sim-section">
                        <h4>Simulation Controls</h4>
                        <button
                            className="connection-sim-btn"
                            onClick={connectionSimulator.toggleSimulation}
                        >
                            {connectionSimulator.isSimulationActive ? '🛑 Stop Simulation' : '▶️ Start Simulation'}
                        </button>
                        <button
                            className="connection-sim-btn secondary"
                            onClick={connectionSimulator.resetSimulation}
                        >
                            🔄 Reset
                        </button>
                    </div>

                    {/* Load Level Controls */}
                    <div className="connection-sim-section">
                        <h4>Load Level</h4>
                        {getConnectionLoadLevels().map(level => (
                            <button
                                key={level}
                                className="connection-sim-btn"
                                style={{
                                    background: connectionSimulator.currentLoadLevel === level ? '#1d4ed8' : '#2563eb'
                                }}
                                onClick={() => handleLoadLevelChange(level)}
                            >
                                {level.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Predefined Scenarios */}
                    <div className="connection-sim-section">
                        <h4>Predefined Scenarios</h4>
                        <select
                            className="connection-sim-select"
                            value={selectedScenario}
                            onChange={(e) => handleScenarioSelect(e.target.value)}
                        >
                            <option value="">Select a scenario...</option>
                            {CONNECTION_SCENARIOS.map(scenario => (
                                <option key={scenario.id} value={scenario.id}>
                                    {scenario.name} - {scenario.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Manual Controls */}
                    <div className="connection-sim-section">
                        <h4>Manual Controls</h4>
                        <div>
                            <span>Connection Attempts: </span>
                            <button className="connection-sim-btn" onClick={() => handleManualConnectionAttempts(1)}>+1</button>
                            <button className="connection-sim-btn" onClick={() => handleManualConnectionAttempts(10)}>+10</button>
                            <button className="connection-sim-btn" onClick={() => handleManualConnectionAttempts(50)}>+50</button>
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <span>Connection Closures: </span>
                            <button className="connection-sim-btn danger" onClick={() => handleManualConnectionClosures(1)}>-1</button>
                            <button className="connection-sim-btn danger" onClick={() => handleManualConnectionClosures(10)}>-10</button>
                            <button className="connection-sim-btn danger" onClick={() => handleManualConnectionClosures(50)}>-50</button>
                        </div>
                    </div>

                    {/* Configuration */}
                    <div className="connection-sim-section">
                        <h4>Configuration</h4>
                        <div>
                            <span>Max Connections: </span>
                            <input
                                type="number"
                                className="connection-sim-input"
                                value={connectionSimulator.maxConnections}
                                onChange={(e) => connectionSimulator.updateConfiguration({ maxConnections: parseInt(e.target.value) })}
                                min="100"
                                max="5000"
                            />
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <span>Inactivity Timeout (seconds): </span>
                            <input
                                type="number"
                                className="connection-sim-input"
                                value={Math.floor(connectionSimulator.inactivityTimeout / 1000)}
                                onChange={(e) => connectionSimulator.updateConfiguration({ inactivityTimeout: parseInt(e.target.value) * 1000 })}
                                min="30"
                                max="600"
                            />
                        </div>
                    </div>

                    {/* Real-time Metrics */}
                    <div className="connection-sim-section">
                        <h4>Real-time Metrics</h4>
                        <div className="connection-sim-metrics">
                            <div className="connection-sim-metric">
                                Health Status: <span>{metrics.healthStatus.toUpperCase()}</span>
                            </div>
                            <div className="connection-sim-metric">
                                Active Connections: <span>{metrics.activeConnections} / {connectionSimulator.maxConnections}</span>
                            </div>
                            <div className="connection-sim-metric">
                                Connection Ratio: <span>{(metrics.connectionRatio * 100).toFixed(1)}%</span>
                            </div>
                            <div className="connection-sim-metric">
                                Failure Rate: <span>{metrics.failureRate.toFixed(1)}%</span>
                            </div>
                            <div className="connection-sim-metric">
                                Avg Response Time: <span>{metrics.averageResponseTime.toFixed(0)}ms</span>
                            </div>
                            <div className="connection-sim-metric">
                                Queue Length: <span>{connectionSimulator.connectionQueueLength}</span>
                            </div>
                            <div className="connection-sim-metric">
                                Polling Mode: <span>{connectionSimulator.pollingModeEnabled ? '🟢 Enabled' : '🔴 Disabled'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="connection-sim-section">
                        <h4>Recommendations</h4>
                        {connectionSimulator.getRecommendations().length > 0 ? (
                            <ul className="connection-sim-list">
                                {connectionSimulator.getRecommendations().map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#888' }}>No recommendations at this time.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectionControlSimulator; 