/**
 * Connection Management Simulator Test Script
 * 
 * This script demonstrates how to programmatically test the connection management simulator.
 * You can run this in the browser console or integrate it into your test suite.
 */

// Test configuration
const TEST_CONFIG = {
    loadLevels: ['normal', 'high', 'extreme'] as const,
    connectionLimits: [5, 10, 20, 50],
    throttlingLevels: ['none', 'moderate', 'aggressive'] as const,
    inactivityTimeouts: [30000, 60000, 300000], // 30s, 1min, 5min
    testDuration: 30000, // 30 seconds per test
};

// Test scenarios
const TEST_SCENARIOS = {
    // Test 1: Normal operation
    normalOperation: {
        name: 'Normal Operation',
        setup: (simulator: any) => {
            simulator.simulateLoadLevel('normal');
            simulator.setConnectionLimit(20);
            simulator.setThrottlingLevel('none');
            simulator.enablePollingFallback(false);
            simulator.enablePriorityQueuing(false);
        },
        expected: {
            activeConnections: '<= 20',
            queueLength: '= 0',
            pollingActive: false,
        }
    },

    // Test 2: High load with limits
    highLoadWithLimits: {
        name: 'High Load with Connection Limits',
        setup: (simulator: any) => {
            simulator.simulateLoadLevel('high');
            simulator.setConnectionLimit(10);
            simulator.setThrottlingLevel('moderate');
            simulator.enablePollingFallback(true);
            simulator.enablePriorityQueuing(true);
        },
        expected: {
            activeConnections: '<= 10',
            queueLength: '>= 0',
            pollingActive: true,
        }
    },

    // Test 3: Extreme load with aggressive throttling
    extremeLoadThrottling: {
        name: 'Extreme Load with Aggressive Throttling',
        setup: (simulator: any) => {
            simulator.simulateLoadLevel('extreme');
            simulator.setConnectionLimit(5);
            simulator.setThrottlingLevel('aggressive');
            simulator.setInactivityTimeout(30000);
            simulator.enablePollingFallback(true);
        },
        expected: {
            activeConnections: '<= 5',
            queueLength: '>= 0',
            pollingActive: true,
        }
    },

    // Test 4: Network instability simulation
    networkInstability: {
        name: 'Network Instability Simulation',
        setup: (simulator: any) => {
            simulator.simulateLoadLevel('high');
            simulator.setConnectionLimit(15);
            simulator.setThrottlingLevel('moderate');
            simulator.enablePollingFallback(true);

            // Simulate random disconnections
            const disconnectInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    simulator.forceDisconnect();
                    console.log('🔌 [TEST] Forced disconnection');
                }
            }, 2000);

            // Store interval for cleanup
            (window as any).testDisconnectInterval = disconnectInterval;
        },
        expected: {
            activeConnections: '<= 15',
            queueLength: '>= 0',
            pollingActive: true,
        }
    },

    // Test 5: Recovery testing
    recoveryTest: {
        name: 'Recovery Test',
        setup: (simulator: any) => {
            // Start with extreme conditions
            simulator.simulateLoadLevel('extreme');
            simulator.setConnectionLimit(3);
            simulator.setThrottlingLevel('aggressive');

            // After 10 seconds, return to normal
            setTimeout(() => {
                console.log('🔄 [TEST] Returning to normal conditions');
                simulator.simulateLoadLevel('normal');
                simulator.setConnectionLimit(20);
                simulator.setThrottlingLevel('none');
            }, 10000);
        },
        expected: {
            activeConnections: '<= 20',
            queueLength: '= 0',
            pollingActive: false,
        }
    }
};

/**
 * Connection Management Simulator Test Runner
 */
class ConnectionSimulatorTestRunner {
    private simulator: any;
    private testResults: any[] = [];

    constructor(simulator: any) {
        this.simulator = simulator;
    }

    /**
     * Run all test scenarios
     */
    async runAllTests() {
        console.log('🧪 [TEST_RUNNER] Starting Connection Management Simulator Tests');
        console.log('🧪 [TEST_RUNNER] ===========================================');

        for (const [key, scenario] of Object.entries(TEST_SCENARIOS)) {
            await this.runTest(key, scenario);
        }

        this.printTestSummary();
    }

    /**
     * Run a specific test scenario
     */
    async runTest(testKey: string, scenario: any) {
        console.log(`🧪 [TEST_RUNNER] Running: ${scenario.name}`);
        console.log(`🧪 [TEST_RUNNER] Duration: ${TEST_CONFIG.testDuration / 1000}s`);

        // Setup the scenario
        scenario.setup(this.simulator);

        // Wait for setup to take effect
        await this.delay(1000);

        // Monitor the scenario
        const startTime = Date.now();
        const metrics: any[] = [];

        const monitorInterval = setInterval(() => {
            const currentMetrics = this.getCurrentMetrics();
            metrics.push({
                timestamp: Date.now() - startTime,
                ...currentMetrics
            });
        }, 1000);

        // Run the test for the specified duration
        await this.delay(TEST_CONFIG.testDuration);

        // Stop monitoring
        clearInterval(monitorInterval);

        // Cleanup any test-specific intervals
        if ((window as any).testDisconnectInterval) {
            clearInterval((window as any).testDisconnectInterval);
            (window as any).testDisconnectInterval = null;
        }

        // Analyze results
        const results = this.analyzeTestResults(metrics, scenario.expected);

        this.testResults.push({
            testKey,
            scenario: scenario.name,
            results,
            metrics
        });

        console.log(`🧪 [TEST_RUNNER] Completed: ${scenario.name}`);
        console.log(`🧪 [TEST_RUNNER] Results:`, results);
        console.log('🧪 [TEST_RUNNER] --------------------------------------------');
    }

    /**
     * Get current simulator metrics
     */
    private getCurrentMetrics() {
        const state = this.simulator.state;
        return {
            activeConnections: state.activeConnections,
            connectionLimit: state.connectionLimit,
            queueLength: state.connectionQueue.length,
            loadLevel: state.loadLevel,
            throttlingLevel: state.throttlingLevel,
            pollingActive: state.pollingFallbackActive,
            inactivityTimeout: state.inactivityTimeout,
        };
    }

    /**
     * Analyze test results against expected values
     */
    private analyzeTestResults(metrics: any[], expected: any) {
        const results: any = {
            passed: true,
            details: {}
        };

        // Calculate averages from metrics
        const avgMetrics = this.calculateAverageMetrics(metrics);

        // Check each expected condition
        for (const [key, expectedValue] of Object.entries(expected)) {
            const actualValue = avgMetrics[key];
            const passed = this.evaluateCondition(actualValue, expectedValue as string);

            results.details[key] = {
                expected: expectedValue,
                actual: actualValue,
                passed
            };

            if (!passed) {
                results.passed = false;
            }
        }

        return results;
    }

    /**
     * Calculate average metrics from collected data
     */
    private calculateAverageMetrics(metrics: any[]) {
        if (metrics.length === 0) return {};

        const sums: any = {};
        const counts: any = {};

        metrics.forEach(metric => {
            Object.keys(metric).forEach(key => {
                if (key !== 'timestamp' && typeof metric[key] === 'number') {
                    sums[key] = (sums[key] || 0) + metric[key];
                    counts[key] = (counts[key] || 0) + 1;
                }
            });
        });

        const averages: any = {};
        Object.keys(sums).forEach(key => {
            averages[key] = Math.round(sums[key] / counts[key]);
        });

        return averages;
    }

    /**
     * Evaluate a condition (e.g., "<= 20", "= 0", ">= 0")
     */
    private evaluateCondition(actual: number, expected: string): boolean {
        const match = expected.match(/^([<>=]+)\s*(\d+)$/);
        if (!match) return false;

        const [, operator, value] = match;
        const numValue = parseInt(value);

        switch (operator) {
            case '<=': return actual <= numValue;
            case '>=': return actual >= numValue;
            case '=': return actual === numValue;
            case '<': return actual < numValue;
            case '>': return actual > numValue;
            default: return false;
        }
    }

    /**
     * Print test summary
     */
    private printTestSummary() {
        console.log('🧪 [TEST_RUNNER] ===========================================');
        console.log('🧪 [TEST_RUNNER] TEST SUMMARY');
        console.log('🧪 [TEST_RUNNER] ===========================================');

        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.results.passed).length;
        const failedTests = totalTests - passedTests;

        console.log(`🧪 [TEST_RUNNER] Total Tests: ${totalTests}`);
        console.log(`🧪 [TEST_RUNNER] Passed: ${passedTests}`);
        console.log(`🧪 [TEST_RUNNER] Failed: ${failedTests}`);
        console.log(`🧪 [TEST_RUNNER] Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

        console.log('\n🧪 [TEST_RUNNER] Detailed Results:');
        this.testResults.forEach(result => {
            const status = result.results.passed ? '✅ PASS' : '❌ FAIL';
            console.log(`🧪 [TEST_RUNNER] ${status} - ${result.scenario}`);

            if (!result.results.passed) {
                Object.entries(result.results.details).forEach(([key, detail]: [string, any]) => {
                    if (!detail.passed) {
                        console.log(`🧪 [TEST_RUNNER]   ❌ ${key}: expected ${detail.expected}, got ${detail.actual}`);
                    }
                });
            }
        });
    }

    /**
     * Utility function for delays
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Quick test functions for manual testing
 */
export const ConnectionSimulatorTests = {
    /**
     * Run a quick load test
     */
    quickLoadTest: (simulator: any) => {
        console.log('🧪 [QUICK_TEST] Starting quick load test');

        simulator.simulateLoadLevel('normal');
        console.log('🧪 [QUICK_TEST] Set to normal load');

        setTimeout(() => {
            simulator.simulateLoadLevel('high');
            console.log('🧪 [QUICK_TEST] Set to high load');
        }, 5000);

        setTimeout(() => {
            simulator.simulateLoadLevel('extreme');
            console.log('🧪 [QUICK_TEST] Set to extreme load');
        }, 10000);

        setTimeout(() => {
            simulator.simulateLoadLevel('normal');
            console.log('🧪 [QUICK_TEST] Returned to normal load');
        }, 15000);
    },

    /**
     * Run a connection limit test
     */
    connectionLimitTest: (simulator: any) => {
        console.log('🧪 [QUICK_TEST] Starting connection limit test');

        simulator.setConnectionLimit(5);
        console.log('🧪 [QUICK_TEST] Set connection limit to 5');

        setTimeout(() => {
            simulator.setConnectionLimit(20);
            console.log('🧪 [QUICK_TEST] Increased connection limit to 20');
        }, 10000);
    },

    /**
     * Run a throttling test
     */
    throttlingTest: (simulator: any) => {
        console.log('🧪 [QUICK_TEST] Starting throttling test');

        simulator.setThrottlingLevel('none');
        console.log('🧪 [QUICK_TEST] No throttling');

        setTimeout(() => {
            simulator.setThrottlingLevel('moderate');
            console.log('🧪 [QUICK_TEST] Moderate throttling');
        }, 5000);

        setTimeout(() => {
            simulator.setThrottlingLevel('aggressive');
            console.log('🧪 [QUICK_TEST] Aggressive throttling');
        }, 10000);

        setTimeout(() => {
            simulator.setThrottlingLevel('none');
            console.log('🧪 [QUICK_TEST] No throttling (recovered)');
        }, 15000);
    },

    /**
     * Run all comprehensive tests
     */
    runAllTests: (simulator: any) => {
        const testRunner = new ConnectionSimulatorTestRunner(simulator);
        testRunner.runAllTests();
    }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
    (window as any).ConnectionSimulatorTests = ConnectionSimulatorTests;
}

export default ConnectionSimulatorTests; 