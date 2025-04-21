import React, { useState, useEffect } from 'react';
import FishPrawnCrabSettlementResult from '../../games/saba-club/fish-prawn-crab/settlement-result';
import FishPrawnCrabDice, { FishPrawnCrabSymbol } from '../../_shared/components/fish-prawn-crab-dice';
import { AnimatedDiceSet } from '../../_shared/components/fish-prawn-crab-dice/animated-dice';
import { Size } from '../../_shared/constants';
import styles from './fish-prawn-crab-animation-demo.module.scss';
import { IPropsObserver } from '../../_shared/components/observer-component/observer-component';

// Define sample results for demonstration
const SAMPLE_RESULTS = [
    // Fish, Crab, Prawn
    {
        dice1: FishPrawnCrabSymbol.FISH,
        dice2: FishPrawnCrabSymbol.CRAB,
        dice3: FishPrawnCrabSymbol.PRAWN,
    },
    // Triple Fish
    {
        dice1: FishPrawnCrabSymbol.FISH,
        dice2: FishPrawnCrabSymbol.FISH,
        dice3: FishPrawnCrabSymbol.FISH,
    },
    // Stag, Gourd, Rooster
    {
        dice1: FishPrawnCrabSymbol.STAG,
        dice2: FishPrawnCrabSymbol.GOURD,
        dice3: FishPrawnCrabSymbol.ROOSTER,
    },
    // Random combination
    {
        dice1: FishPrawnCrabSymbol.FISH,
        dice2: FishPrawnCrabSymbol.ROOSTER,
        dice3: FishPrawnCrabSymbol.STAG,
    },
];

const resultToSettlementResult = (diceResult) => {
    // Create a sample settlement result based on dice values
    const settlementResult = {
        fish: false,
        prawn: false,
        crab: false,
        rooster: false,
        gourd: false,
        stag: false,
    };

    // Count occurrences of each symbol
    const symbolCount = {
        [FishPrawnCrabSymbol.FISH]: 0,
        [FishPrawnCrabSymbol.CRAB]: 0,
        [FishPrawnCrabSymbol.PRAWN]: 0,
        [FishPrawnCrabSymbol.ROOSTER]: 0,
        [FishPrawnCrabSymbol.GOURD]: 0,
        [FishPrawnCrabSymbol.STAG]: 0,
    };

    [diceResult.dice1, diceResult.dice2, diceResult.dice3].forEach(dice => {
        symbolCount[dice]++;
    });

    // Set winning symbols (any that appear at least once)
    if (symbolCount[FishPrawnCrabSymbol.FISH] > 0) settlementResult.fish = true;
    if (symbolCount[FishPrawnCrabSymbol.CRAB] > 0) settlementResult.crab = true;
    if (symbolCount[FishPrawnCrabSymbol.PRAWN] > 0) settlementResult.prawn = true;
    if (symbolCount[FishPrawnCrabSymbol.ROOSTER] > 0) settlementResult.rooster = true;
    if (symbolCount[FishPrawnCrabSymbol.GOURD] > 0) settlementResult.gourd = true;
    if (symbolCount[FishPrawnCrabSymbol.STAG] > 0) settlementResult.stag = true;

    return settlementResult;
};

const FishPrawnCrabAnimationDemo = () => {
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [result, setResult] = useState(SAMPLE_RESULTS[0]);
    const [settlementResult, setSettlementResult] = useState(resultToSettlementResult(SAMPLE_RESULTS[0]));
    const [isAnimationResult, setIsAnimationResult] = useState(false);
    const [winningSymbols, setWinningSymbols] = useState<string[]>([]);
    const [showAnimatedDice, setShowAnimatedDice] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(true);

    // Show the next result when Next button is clicked
    const handleNextResult = () => {
        setIsAnimationResult(false);
        setAnimationComplete(false);

        // Move to next result in the sample array
        const nextIndex = (currentResultIndex + 1) % SAMPLE_RESULTS.length;
        setCurrentResultIndex(nextIndex);

        const nextResult = SAMPLE_RESULTS[nextIndex];
        setResult(nextResult);

        const nextSettlementResult = resultToSettlementResult(nextResult);
        setSettlementResult(nextSettlementResult);

        // Set winning symbols based on settlement result
        const winningSyms = Object.entries(nextSettlementResult)
            .filter(([_, value]) => value)
            .map(([key]) => key);
        setWinningSymbols(winningSyms);

        // Trigger animation after a short delay
        setTimeout(() => {
            setShowAnimatedDice(true);
            setIsAnimationResult(true);
        }, 500);
    };

    // Initialize with animation on first load
    useEffect(() => {
        setTimeout(() => {
            setShowAnimatedDice(true);
            setIsAnimationResult(true);
        }, 500);

        // Set initial winning symbols
        const initialWinningSyms = Object.entries(settlementResult)
            .filter(([_, value]) => value)
            .map(([key]) => key);
        setWinningSymbols(initialWinningSyms);
    }, []);

    // Get the name of a symbol from its enum value
    const getSymbolName = (symbolValue: FishPrawnCrabSymbol): string => {
        const symbolMap = {
            [FishPrawnCrabSymbol.FISH]: 'fish',
            [FishPrawnCrabSymbol.CRAB]: 'crab',
            [FishPrawnCrabSymbol.PRAWN]: 'prawn',
            [FishPrawnCrabSymbol.ROOSTER]: 'rooster',
            [FishPrawnCrabSymbol.GOURD]: 'gourd',
            [FishPrawnCrabSymbol.STAG]: 'stag',
        };
        return symbolMap[symbolValue];
    };

    // Add a random result
    const handleRandomResult = () => {
        setIsAnimationResult(false);
        setAnimationComplete(false);

        // Generate a random result
        const randomResult = {
            dice1: Math.floor(Math.random() * 6) as FishPrawnCrabSymbol,
            dice2: Math.floor(Math.random() * 6) as FishPrawnCrabSymbol,
            dice3: Math.floor(Math.random() * 6) as FishPrawnCrabSymbol,
        };

        setResult(randomResult);

        const randomSettlementResult = resultToSettlementResult(randomResult);
        setSettlementResult(randomSettlementResult);

        // Set winning symbols based on settlement result
        const winningSyms = Object.entries(randomSettlementResult)
            .filter(([_, value]) => value)
            .map(([key]) => key);
        setWinningSymbols(winningSyms);

        // Trigger animation after a short delay
        setTimeout(() => {
            setShowAnimatedDice(true);
            setIsAnimationResult(true);
        }, 500);
    };

    const handleDiceAnimationComplete = () => {
        setAnimationComplete(true);
        setShowAnimatedDice(false);
    };

    // Create props object for FishPrawnCrabSettlementResult
    const settlementProps: IPropsObserver = {
        namespace: "fpc-animation-demo",
        language: "en"
    };

    return (
        <div className={styles['fpc-animation-demo']}>
            <h1>Fish-Prawn-Crab Animation Demo</h1>

            <div className={styles['demo-container']}>
                {/* Display current dice result */}
                <div className={styles['settlement-demo']}>
                    {showAnimatedDice ? (
                        <div className={styles['animated-dice-container']}>
                            <AnimatedDiceSet
                                finalSymbols={[result.dice1, result.dice2, result.dice3]}
                                size={Size.large}
                                animationDuration={3000}
                                onAllAnimationsComplete={handleDiceAnimationComplete}
                                staggerDelay={200}
                            />
                        </div>
                    ) : (
                        <div className={styles['dice-container']}>
                            {[result.dice1, result.dice2, result.dice3].map((symbol, index) => (
                                <div
                                    key={index}
                                    className={`${styles['dice-item']} ${winningSymbols.includes(getSymbolName(symbol)) ? styles['winning'] : ''}`}
                                >
                                    <FishPrawnCrabDice
                                        symbol={symbol}
                                        size={Size.large}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles['result-info']}>
                        <h3>Winning Symbols:</h3>
                        <div className={styles['winning-symbols']}>
                            {winningSymbols.length > 0 ? (
                                winningSymbols.map((symbol, index) => (
                                    <span key={index} className={styles['winning-symbol']}>{symbol}</span>
                                ))
                            ) : (
                                <span>No winning symbols</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Animation component */}
                <div className={`${styles['animation-container']} ${isAnimationResult ? styles['active'] : ''}`}>
                    <FishPrawnCrabSettlementResult
                        {...settlementProps}
                    />
                </div>
            </div>

            <div className={styles['controls']}>
                <button
                    onClick={handleNextResult}
                    className={styles['demo-button']}
                    disabled={!animationComplete}
                >
                    Next Sample Result
                </button>
                <button
                    onClick={handleRandomResult}
                    className={styles['demo-button']}
                    disabled={!animationComplete}
                >
                    Random Result
                </button>
            </div>
        </div>
    );
};

export default FishPrawnCrabAnimationDemo; 