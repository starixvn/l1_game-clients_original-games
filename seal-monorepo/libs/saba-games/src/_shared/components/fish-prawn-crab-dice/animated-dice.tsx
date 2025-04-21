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

    // Used to track animation timing
    const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Track current animation speed
    const speedRef = useRef<number>(200); // Ms between symbol changes
    const animationStartTimeRef = useRef<number>(0);

    // Generate random symbol (1-6)
    const getRandomSymbol = (): FishPrawnCrabSymbol => {
        const randomValue = Math.floor(Math.random() * 6) + 1; // 1-6
        return diceValueToSymbol(randomValue);
    };

    // Cleanup function
    const clearTimers = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
            animationTimerRef.current = null;
        }
    };

    // Start animation
    const startAnimation = () => {
        clearTimers(); // Clear any existing timers

        setIsAnimating(true);
        animationStartTimeRef.current = Date.now();

        // Set initial interval for changing symbols
        intervalRef.current = setInterval(() => {
            // Calculate elapsed time since animation started
            const elapsedTime = Date.now() - animationStartTimeRef.current;
            const progress = elapsedTime / animationDuration;

            // First phase (0-40%): Speed up
            if (progress < 0.4) {
                // Start at 200ms and decrease to 50ms (speed up)
                speedRef.current = 200 - (150 * (progress / 0.4));
            }
            // Second phase (40-100%): Slow down
            else {
                // Start at 50ms and increase to 500ms (slow down)
                speedRef.current = 50 + (450 * ((progress - 0.4) / 0.6));
            }

            // Update the interval timing
            clearInterval(intervalRef.current!);

            // If we're close to the end and speed is very slow
            if (progress > 0.9 && speedRef.current > 400) {
                // Show the final result soon
                if (progress > 0.95) {
                    setCurrentSymbol(finalSymbol);
                    clearTimers();
                    setIsAnimating(false);
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                    return;
                }
            }

            // Continue with random symbols until the very end
            setCurrentSymbol(getRandomSymbol());

            // Update interval with new speed
            intervalRef.current = setInterval(() => {
                setCurrentSymbol(getRandomSymbol());
            }, Math.round(speedRef.current));

        }, Math.round(speedRef.current));

        // Set timeout to end animation
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
    }, [finalSymbol, animationDuration]); // Re-run if these props change

    return (
        <div style={{
            display: 'inline-block',
            animation: isAnimating ? 'shake 0.5s infinite' : 'none'
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
    }, [completedAnimations, finalSymbols.length]);

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