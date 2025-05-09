import React, { useState, useEffect, useRef } from 'react';
import { ColorGameSymbol, diceValueToSymbol } from './index';
import ColorGameDice from './index';
import { Size } from "../../constants";
import styles from './color-game-dice.module.scss';

interface AnimatedDiceProps {
    finalSymbol: ColorGameSymbol;
    size?: typeof Size.large | typeof Size.medium | typeof Size.small;
    animationDuration?: number;
    onAnimationComplete?: () => void;
    delayStart?: number;
    finalRollDelay?: number;
}

const AnimatedDice: React.FC<AnimatedDiceProps> = ({
    finalSymbol,
    size = Size.large,
    animationDuration = 3000,
    onAnimationComplete,
    delayStart = 0,
    finalRollDelay = 0
}) => {
    const [currentSymbol, setCurrentSymbol] = useState<ColorGameSymbol>(ColorGameSymbol.EMPTY);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [rotationClass, setRotationClass] = useState<string>('');
    const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
    const rollTimersRef = useRef<NodeJS.Timeout[]>([]);

    const getRandomSymbol = (): ColorGameSymbol => {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        return diceValueToSymbol(randomValue);
    };

    const clearTimers = () => {
        rollTimersRef.current.forEach(timer => clearTimeout(timer));
        rollTimersRef.current = [];

        if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
            animationTimerRef.current = null;
        }
    };

    const startAnimation = () => {
        clearTimers();
        setIsAnimating(true);

        // Define roll timings
        const rollTimes = [
            0,           // First roll immediately
            100,         // +0.1s
            200,         // +0.1s
            300,         // +0.1s
            400,         // +0.1s
            600,         // +0.2s
            800,         // +0.2s
            1100,        // +0.3s
            1500 + finalRollDelay  // +0.4s (final reveal) + finalRollDelay
        ];

        const totalDuration = animationDuration + finalRollDelay;

        // Schedule rotations and symbol changes
        rollTimes.forEach((time, index) => {
            if (index < rollTimes.length - 1) {
                const timer = setTimeout(() => {
                    setCurrentSymbol(getRandomSymbol());

                    // Apply different rotation speeds based on the phase
                    if (index < 4) {
                        setRotationClass(styles['rotate-fast']);
                    } else if (index < 6) {
                        setRotationClass(styles['rotate-medium']);
                    } else {
                        setRotationClass(styles['rotate-slow']);
                    }

                    // Clear rotation class after animation
                    const animDuration = index < 4 ? 300 : index < 6 ? 500 : 700;
                    const clearTimer = setTimeout(() => {
                        setRotationClass('');
                    }, animDuration);
                    rollTimersRef.current.push(clearTimer);
                }, time);

                rollTimersRef.current.push(timer);
            }
        });

        // Final reveal
        const finalRevealTimer = setTimeout(() => {
            setCurrentSymbol(finalSymbol);
            setIsAnimating(false);
            setRotationClass(styles['rotate-final']);

            const clearTimer = setTimeout(() => {
                setRotationClass('');
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            }, 700);
            rollTimersRef.current.push(clearTimer);
        }, rollTimes[rollTimes.length - 1]);

        rollTimersRef.current.push(finalRevealTimer);

        // Backup timeout
        animationTimerRef.current = setTimeout(() => {
            clearTimers();
            setCurrentSymbol(finalSymbol);
            setIsAnimating(false);
            setRotationClass('');
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, totalDuration + 100);
    };

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
    }, [finalSymbol, animationDuration, delayStart, finalRollDelay]);

    return (
        <div className={styles['dice-container']}>
            <div className={`${styles['dice-3d']} ${rotationClass}`}>
                <div className={styles['dice-face']} style={{ transform: 'translateZ(24px)' }}>
                    <ColorGameDice symbol={currentSymbol} size={size} isWooden={true} />
                </div>
                <div className={styles['dice-face']} style={{ transform: 'rotateY(180deg) translateZ(24px)' }}>
                    <ColorGameDice symbol={getRandomSymbol()} size={size} isWooden={true} />
                </div>
                <div className={styles['dice-face']} style={{ transform: 'rotateY(90deg) translateZ(24px)' }}>
                    <ColorGameDice symbol={getRandomSymbol()} size={size} isWooden={true} />
                </div>
                <div className={styles['dice-face']} style={{ transform: 'rotateY(-90deg) translateZ(24px)' }}>
                    <ColorGameDice symbol={getRandomSymbol()} size={size} isWooden={true} />
                </div>
                <div className={styles['dice-face']} style={{ transform: 'rotateX(90deg) translateZ(24px)' }}>
                    <ColorGameDice symbol={getRandomSymbol()} size={size} isWooden={true} />
                </div>
                <div className={styles['dice-face']} style={{ transform: 'rotateX(-90deg) translateZ(24px)' }}>
                    <ColorGameDice symbol={getRandomSymbol()} size={size} isWooden={true} />
                </div>
            </div>
        </div>
    );
};

// Component for a set of animated dice
interface AnimatedDiceSetProps {
    finalSymbols: ColorGameSymbol[];
    size?: typeof Size.large | typeof Size.medium | typeof Size.small | typeof Size.xLarge;
    animationDuration?: number;
    onAllAnimationsComplete?: () => void;
    staggerDelay?: number;
    finalRollSequenceDelay?: number;
}

export const AnimatedDiceSet: React.FC<AnimatedDiceSetProps> = ({
    finalSymbols,
    size = Size.large,
    animationDuration = 3000,
    onAllAnimationsComplete,
    staggerDelay = 100,
    finalRollSequenceDelay = 200
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
        <div className={styles['dice-set-container']}>
            {finalSymbols.map((symbol, index) => (
                <AnimatedDice
                    key={index}
                    finalSymbol={symbol}
                    size={size}
                    animationDuration={animationDuration}
                    onAnimationComplete={handleAnimationComplete}
                    delayStart={index * staggerDelay}
                    finalRollDelay={index * finalRollSequenceDelay}
                />
            ))}
        </div>
    );
};

export default AnimatedDice; 