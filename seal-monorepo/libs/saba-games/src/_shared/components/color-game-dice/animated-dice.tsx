import React, { useState, useEffect, useRef } from 'react';
import { ColorGameSymbol } from './index';
import ColorGameDice from './index';
import { Size } from "../../constants";
import styles from './color-game-dice.module.scss';

const DICE_SYMBOLS_LIST = [
    ColorGameSymbol.RED,
    ColorGameSymbol.GREEN,
    ColorGameSymbol.BLUE,
    ColorGameSymbol.YELLOW,
    ColorGameSymbol.WHITE,
    ColorGameSymbol.PINK
];


interface AnimatedDiceProps {
    finalSymbol: ColorGameSymbol[];
    onAnimationComplete?: () => void;
    delayStart?: number;
}

const AnimatedDice: React.FC<AnimatedDiceProps> = ({
    finalSymbol,
    onAnimationComplete,
    delayStart = 0,
}) => {
    const [isStartAnimation, setIsStartAnimation] = useState(false);
    const [reel1Animation, setReel1Animation] = useState<string>('start');
    const [reel2Animation, setReel2Animation] = useState<string>('start');
    const reel1Ref = useRef<HTMLDivElement>(null);
    const reel2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsStartAnimation(true);
        }, delayStart);

        return () => clearTimeout(timer);
    }, [delayStart]);

    useEffect(() => {
        const reel1 = reel1Ref.current;
        if (reel1) {
            const handleAnimationEnd = (e: AnimationEvent) => {
                if (reel1Animation === 'start') {
                    setReel1Animation('loop');
                }
            };

            reel1.addEventListener('animationend', handleAnimationEnd);
            return () => {
                reel1.removeEventListener('animationend', handleAnimationEnd);
            };
        }
    }, []);

    useEffect(() => {
        const reel2 = reel2Ref.current;
        if (reel2) {
            const handleAnimationEnd = (e: AnimationEvent) => {
                if (reel2Animation === 'start') {
                    setReel2Animation('loop');
                }
            };

            reel2.addEventListener('animationend', handleAnimationEnd);
            return () => {
                reel2.removeEventListener('animationend', handleAnimationEnd);
            };
        }
    }, []);

    return (
        <div className={styles['dice-container']}>
            <div className={styles['slot-container']}>
                <div
                    ref={reel1Ref}
                    className={`${styles['reel-1']} ${isStartAnimation ? styles[`slot-rolling-1-${reel1Animation}`] : ''}`}
                >
                    {DICE_SYMBOLS_LIST.map((symbol, index) => (
                        <ColorGameDice
                            key={`reel1-${index}`}
                            symbol={symbol}
                            size={Size.large}
                        />
                    ))}
                </div>
                <div
                    ref={reel2Ref}
                    className={`${styles['reel-2']} ${isStartAnimation ? styles[`slot-rolling-2-${reel2Animation}`] : ''}`}
                >
                    {DICE_SYMBOLS_LIST.map((symbol, index) => (
                        <ColorGameDice
                            key={`reel2-${index}`}
                            symbol={symbol}
                            size={Size.large}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

interface AnimatedDiceSetProps {
    finalSymbols: ColorGameSymbol[];
    onAllAnimationsComplete?: () => void;
    staggerDelay?: number;
}

export const AnimatedDiceSet: React.FC<AnimatedDiceSetProps> = ({
    finalSymbols,
    onAllAnimationsComplete,
    staggerDelay = 100,
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
                    finalSymbol={[symbol]}
                    onAnimationComplete={handleAnimationComplete}
                    delayStart={index * staggerDelay}
                />
            ))}
        </div>
    );
};

export default AnimatedDice; 