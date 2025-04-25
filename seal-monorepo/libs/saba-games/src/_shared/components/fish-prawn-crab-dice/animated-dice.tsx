import React, { useState, useEffect, useRef } from 'react';
import { FishPrawnCrabSymbol, diceValueToSymbol } from './index';
import FishPrawnCrabDice from './index';
import { Size } from "../../constants";

interface AnimatedDiceProps {
    finalSymbol: FishPrawnCrabSymbol;
    size?: typeof Size.large | typeof Size.medium | typeof Size.small;
    animationDuration?: number;
    onAnimationComplete?: () => void;
    delayStart?: number;
}

const AnimatedDice: React.FC<AnimatedDiceProps> = ({
    finalSymbol,
    size = Size.large,
    animationDuration = 3000,
    onAnimationComplete,
    delayStart = 0
}) => {
    // Current displayed symbol
    const [currentSymbol, setCurrentSymbol] = useState<FishPrawnCrabSymbol>(FishPrawnCrabSymbol.EMPTY);

    // Animation state
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [shakeFrequency, setShakeFrequency] = useState<number>(0.2); // Initial shake duration (faster)

    // Used to track animation timing
    const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
    const rollTimersRef = useRef<NodeJS.Timeout[]>([]);

    // Generate random symbol (1-6)
    const getRandomSymbol = (): FishPrawnCrabSymbol => {
        const randomValue = Math.floor(Math.random() * 6) + 1; // 1-6
        return diceValueToSymbol(randomValue);
    };

    // Cleanup function
    const clearTimers = () => {
        rollTimersRef.current.forEach(timer => clearTimeout(timer));
        rollTimersRef.current = [];

        if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
            animationTimerRef.current = null;
        }
    };

    // Start animation
    const startAnimation = () => {
        clearTimers(); // Clear any existing timers
        setIsAnimating(true);

        // Define roll timings based on requirements:
        // - 4 first rolls with 0.1s between them
        // - 2 next rolls with 0.2s between them
        // - Next roll with 0.3s delay
        // - Last roll with 0.4s delay
        const rollTimes = [
            0,           // First roll immediately
            100,         // +0.1s
            200,         // +0.1s
            300,         // +0.1s
            400,         // +0.1s
            600,         // +0.2s
            800,         // +0.2s
            1100,        // +0.3s
            1500         // +0.4s (final reveal)
        ];

        // Total animation duration
        const totalDuration = animationDuration;

        // Keep track of which main roll we're currently in
        let currentRollIndex = 0;

        // Number of symbol changes per roll (mini-physics simulation within each roll)
        const symbolsPerRoll = 6;

        // Schedule physics-based symbol changes within each roll window
        for (let i = 0; i < rollTimes.length - 1; i++) {
            const rollStartTime = rollTimes[i];
            const nextRollTime = rollTimes[i + 1];
            const rollDuration = nextRollTime - rollStartTime;

            // Calculate how far into the animation this roll is (for proper physics feel)
            const rollProgress = rollStartTime / totalDuration;

            // Apply different physics behavior based on which phase we're in
            // Early rolls: faster changes (acceleration)
            // Middle rolls: peak speed
            // Later rolls: slower changes (deceleration)

            for (let j = 0; j < symbolsPerRoll; j++) {
                let symbolTime: number;

                if (i < 4) {
                    // First 4 rolls: acceleration phase - non-linear distribution
                    // Earlier symbols change slower, later symbols change faster
                    const adjustedProgress = Math.pow(j / symbolsPerRoll, 1.5);
                    symbolTime = rollStartTime + Math.floor(adjustedProgress * rollDuration);
                }
                else if (i < 6) {
                    // Middle 2 rolls: peak speed - evenly distributed
                    symbolTime = rollStartTime + Math.floor(j * (rollDuration / symbolsPerRoll));
                }
                else {
                    // Last 2 rolls: deceleration phase - non-linear distribution
                    // Earlier symbols change faster, later symbols change slower
                    const adjustedProgress = 1 - Math.pow(1 - (j / symbolsPerRoll), 1.5);
                    symbolTime = rollStartTime + Math.floor(adjustedProgress * rollDuration);
                }

                const timer = setTimeout(() => {
                    setCurrentSymbol(getRandomSymbol());
                }, symbolTime);

                rollTimersRef.current.push(timer);
            }

            // Set shake frequency for this roll
            const timer = setTimeout(() => {
                if (i < 2) {
                    // First 2 rolls: Fast shaking (initial toss)
                    setShakeFrequency(0.2);
                }
                else if (i < 5) {
                    // Next 3 rolls: Medium shaking
                    setShakeFrequency(0.4);
                }
                else {
                    // Last rolls: Slow shaking (settling)
                    setShakeFrequency(0.7);
                }
            }, rollStartTime);

            rollTimersRef.current.push(timer);
        }

        // Add highlight symbols at exact roll times
        rollTimes.forEach((time, index) => {
            if (index < rollTimes.length - 1) { // Skip the last time (final reveal)
                const timer = setTimeout(() => {
                    // Highlight roll point with a new symbol
                    setCurrentSymbol(getRandomSymbol());
                }, time);

                rollTimersRef.current.push(timer);
            }
        });

        // Final reveal (show the final symbol)
        const finalRevealTimer = setTimeout(() => {
            setCurrentSymbol(finalSymbol);
            setIsAnimating(false);
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, rollTimes[rollTimes.length - 1]);

        rollTimersRef.current.push(finalRevealTimer);

        // Set a backup timeout to ensure animation always completes
        animationTimerRef.current = setTimeout(() => {
            clearTimers();
            setCurrentSymbol(finalSymbol);
            setIsAnimating(false);
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, totalDuration + 100); // Add a small buffer
    };

    // Handle component mount/unmount and props changes
    useEffect(() => {
        if (delayStart > 0) {
            const delayTimer = setTimeout(() => {
                startAnimation();
            }, delayStart);

            return () => clearTimeout(delayTimer);
        } else {
            startAnimation();
        }

        return () => {
            clearTimers();
        };
    }, [finalSymbol, animationDuration, delayStart]); // Added delayStart as a dependency

    return (
        <div style={{
            display: 'inline-block',
            animation: isAnimating ? `shake ${shakeFrequency}s infinite` : 'none'
        }}>
            <FishPrawnCrabDice
                symbol={currentSymbol}
                size={size}
            />
        </div>
    );
};

// Component for a set of animated dice
interface AnimatedDiceSetProps {
    finalSymbols: FishPrawnCrabSymbol[];
    size?: typeof Size.large | typeof Size.medium | typeof Size.small;
    animationDuration?: number;
    onAllAnimationsComplete?: () => void;
    staggerDelay?: number;
}

export const AnimatedDiceSet: React.FC<AnimatedDiceSetProps> = ({
    finalSymbols,
    size = Size.large,
    animationDuration = 3000,
    onAllAnimationsComplete,
    staggerDelay = 100
}) => {
    const [completedAnimations, setCompletedAnimations] = useState(0);

    useEffect(() => {
        if (completedAnimations === finalSymbols.length && onAllAnimationsComplete) {
            onAllAnimationsComplete();
        }
    }, [completedAnimations, finalSymbols.length, onAllAnimationsComplete]);

    const handleAnimationComplete = () => {
        setCompletedAnimations(prev => prev + 1);
    };

    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {finalSymbols.map((symbol, index) => (
                <AnimatedDice
                    key={index}
                    finalSymbol={symbol}
                    size={size}
                    animationDuration={animationDuration}
                    onAnimationComplete={handleAnimationComplete}
                    delayStart={index * staggerDelay}
                />
            ))}
        </div>
    );
};

export default AnimatedDice; 