import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ColorGameSymbol, diceValueToSymbol } from './index';
import ColorGameDice from './index';
import { Size } from "../../constants";
import styles from './color-game-dice.module.scss';

interface DiceFaceProps {
    transform: string;
    symbol: ColorGameSymbol;
    size: typeof Size.large | typeof Size.medium | typeof Size.small;
}

const DiceFace: React.FC<DiceFaceProps> = ({ transform, symbol, size }) => (
    <div className={styles['dice-face']} style={{ transform }}>
        <ColorGameDice symbol={symbol} size={size} isWooden={true} />
    </div>
);

interface AnimatedDiceProps {
    finalSymbol: ColorGameSymbol;
    size?: typeof Size.large | typeof Size.medium | typeof Size.small;
    animationDuration?: number;
    onAnimationComplete?: () => void;
    delayStart?: number;
    finalRollDelay?: number;
}

const ANIMATION_PHASES = [
    { rotation: 'rotate-fast', duration: 2400, rotations: 8 },
    { rotation: 'rotate-medium', duration: 3600, rotations: 7 },
    { rotation: 'rotate-slow', duration: 4800, rotations: 6 },
    { rotation: 'rotate-final', duration: 6000, rotations: 5 },
    { rotation: 'rotate-slow', duration: 4800, rotations: 4 },
    { rotation: 'rotate-medium', duration: 3600, rotations: 2 },
    { rotation: 'rotate-slow', duration: 4800, rotations: 1 },
];

const AnimatedDice: React.FC<AnimatedDiceProps> = ({
    finalSymbol,
    size = Size.large,
    animationDuration = 3000,
    onAnimationComplete,
    delayStart = 0,
    finalRollDelay = 0
}) => {
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [currentSymbol, setCurrentSymbol] = useState<ColorGameSymbol>(ColorGameSymbol.EMPTY);
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
        console.log('Starting animation with final symbol:', finalSymbol);
        clearTimers();
        setIsAnimating(true);

        // Define roll timings (doubled)
        const rollTimes = [
            0,            // First roll immediately
            2400,         // +2.4s
            6000,         // +3.6s
            10800,        // +4.8s
            16800,        // +6s
            21600,        // +4.8s
            26400,        // +4.8s
            30000,        // +3.6s
            36000         // +6s (final reveal)
        ];

        console.log('Animation timings:', rollTimes);

        const totalDuration = animationDuration + finalRollDelay;

        // Schedule rotations and symbol changes
        rollTimes.forEach((time, index) => {
            if (index < rollTimes.length - 1) {
                const timer = setTimeout(() => {
                    console.log(`Step ${index + 1}: Starting at ${time}ms`);

                    // Apply different rotation speeds based on the phase
                    let rotationType = '';
                    if (index === 0) {
                        rotationType = 'rotate-fast'; // 8 rotations
                    } else if (index === 1) {
                        rotationType = 'rotate-medium'; // 7 rotations
                    } else if (index === 2) {
                        rotationType = 'rotate-slow'; // 6 rotations
                    } else if (index === 3) {
                        rotationType = 'rotate-final'; // 5 rotations
                    } else if (index === 4) {
                        rotationType = 'rotate-slow'; // 4 rotations
                    } else if (index === 5) {
                        rotationType = 'rotate-medium'; // 2 rotations
                    } else if (index === 6) {
                        rotationType = 'rotate-slow'; // 1 rotation
                    }
                    console.log(`Step ${index + 1}: Applying rotation:`, rotationType);
                    setRotationClass(styles[rotationType]);

                    // Clear rotation class after animation
                    const animDuration = index === 0 ? 2400 :
                        index === 1 ? 3600 :
                            index === 2 ? 4800 :
                                index === 3 ? 6000 :
                                    index === 4 ? 4800 :
                                        index === 5 ? 3600 :
                                            index === 6 ? 4800 : 0;

                    console.log(`Step ${index + 1}: Animation duration:`, animDuration);

                    const setFinalSymbol = setTimeout(() => {
                        console.log(`set final symbol as ${finalSymbol}`);
                        setCurrentSymbol(finalSymbol);
                    }, animDuration / 10)
                    rollTimersRef.current.push(setFinalSymbol);

                    const clearTimer = setTimeout(() => {
                        console.log(`Step ${index + 1}: Clearing rotation class`);
                        setRotationClass('');
                        // Complete animation after last rotation
                        if (index === rollTimes.length - 2) {
                            console.log('Animation complete');
                            setIsAnimating(false);
                            if (onAnimationComplete) {
                                onAnimationComplete();
                            }
                        }
                    }, animDuration);
                    rollTimersRef.current.push(clearTimer);
                }, time);

                rollTimersRef.current.push(timer);
            }
        });

        // Backup timeout
        animationTimerRef.current = setTimeout(() => {
            console.log('Backup timeout triggered');
            clearTimers();
            setIsAnimating(false);
            setRotationClass('');
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, totalDuration + 100);
    };

    useEffect(() => {
        console.log('Effect triggered with:', {
            finalSymbol,
            animationDuration,
            delayStart,
            finalRollDelay
        });

        if (delayStart > 0) {
            console.log('Starting with delay:', delayStart);
            const delayTimer = setTimeout(() => {
                startAnimation();
            }, delayStart);

            return () => clearTimeout(delayTimer);
        } else {
            startAnimation();
        }

        return () => {
            console.log('Cleaning up timers');
            clearTimers();
        };
    }, [finalSymbol, animationDuration, delayStart, finalRollDelay]);

    const diceFaces = [
        { transform: 'translateZ(21px)' },
        { transform: 'rotateY(180deg) translateZ(21px)' },
        { transform: 'rotateY(90deg) translateZ(21px)' },
        { transform: 'rotateY(-90deg) translateZ(21px)' },
        { transform: 'rotateX(90deg) translateZ(21px)' },
        { transform: 'rotateX(-90deg) translateZ(21px)' },
    ];

    return (
        <div className={styles['dice-container']}>
            <div className={`${styles['dice-3d']} ${rotationClass}`}>
                {diceFaces.map((face, index) => (
                    <DiceFace
                        key={index}
                        transform={face.transform}
                        symbol={index === 0 ? currentSymbol : getRandomSymbol()}
                        size={size}
                    />
                ))}
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