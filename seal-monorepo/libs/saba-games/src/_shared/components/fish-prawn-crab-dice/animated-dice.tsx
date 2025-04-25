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
        // Total: 8 rolls

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

        // Schedule each roll
        for (let i = 0; i < rollTimes.length - 1; i++) {
            const timer = setTimeout(() => {
                setCurrentSymbol(getRandomSymbol());

                // Adjust shake frequency based on progress
                const progress = rollTimes[i] / animationDuration;
                if (progress < 0.4) {
                    // Fast shaking at the beginning
                    setShakeFrequency(0.2);
                } else if (progress < 0.7) {
                    // Medium shaking in the middle
                    setShakeFrequency(0.5);
                } else {
                    // Slower shaking near the end
                    setShakeFrequency(0.8);
                }
            }, rollTimes[i]);

            rollTimersRef.current.push(timer);
        }

        // Final roll (show the final symbol)
        const finalRollTimer = setTimeout(() => {
            setCurrentSymbol(finalSymbol);
            setIsAnimating(false);
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, rollTimes[rollTimes.length - 1]);

        rollTimersRef.current.push(finalRollTimer);

        // Set timeout to end animation if something goes wrong
        animationTimerRef.current = setTimeout(() => {
            clearTimers();
            setCurrentSymbol(finalSymbol);
            setIsAnimating(false);
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, animationDuration);
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