import * as gc from "@sg/sg-game-client";
import React, { memo, useEffect, useMemo, useState, useCallback } from "react";
import styles from "../big-small-settlement-result.module.scss";
import { BigSmallResult } from "../../type";
import { calculateTotalDiceNumber, getRandomDiceNumbers } from "../../../../../_shared/utils/number-helper";
import Dice from "../../../../../_shared/components/dice";

const ANIMATION_INTERVAL = 150;
const ANIMATION_DURATION = 2000;

interface DiceListProps {
    diceNumbers: number[];
}

const DiceList = memo<DiceListProps>(({ diceNumbers }) => (
    <div className={styles.diceList}>
        {diceNumbers.map((number, index) => (
            <Dice key={index} diceNumber={number} />
        ))}
    </div>
));

interface TotalDiceNumberProps {
    total: number;
    language?: string;
    settlementResult: gc.GameServiceMessage.TSettlementResult | undefined;
}

const TotalDiceNumber = memo<TotalDiceNumberProps>(({ total, language, settlementResult }) => {
    if (total <= 0) return null;
    const settlement = settlementResult ? settlementResult : {};
    let resultText = '';
    if (settlement.big) {
        resultText = gc.Translator.t('UnbalancedBigSmall4.big', { lng: language || '' });
    } else if (settlement.small) {
        resultText = gc.Translator.t('UnbalancedBigSmall4.small', { lng: language || '' });
    }
    return (
        <div className={styles.diceResult}>
            <div className={`${styles['winner-display']} `}>
                <p className={styles['winner-text']}>
                    {total} - {resultText}
                </p>
            </div>

        </div>
    );
});


interface DiceDisplayProps {
    result: BigSmallResult;
    isAnimationResult: boolean;
    language?: string;
    settlementResult: gc.GameServiceMessage.TSettlementResult | undefined;
}

export const DiceDisplay = memo<DiceDisplayProps>(({ result, isAnimationResult, language, settlementResult }) => {
    const [diceNumbers, setDiceNumbers] = useState(() => [0, 0, 0]);
    const [totalDiceNumber, setTotalDiceNumber] = useState(0);

    const finalDiceNumbers = useMemo(() => (
        [result.dice1, result.dice2, result.dice3]
    ), [result.dice1, result.dice2, result.dice3]);

    const updateFinalResult = useCallback(() => {
        setDiceNumbers(finalDiceNumbers);
        setTotalDiceNumber(calculateTotalDiceNumber(finalDiceNumbers));
    }, [finalDiceNumbers]);

    useEffect(() => {
        if (!isAnimationResult) {
            updateFinalResult();
            return;
        }

        const animationInterval = setInterval(() => {
            setDiceNumbers(getRandomDiceNumbers());
        }, ANIMATION_INTERVAL);

        const animationTimeout = setTimeout(() => {
            clearInterval(animationInterval);
            updateFinalResult();
        }, ANIMATION_DURATION);

        return () => {
            clearInterval(animationInterval);
            clearTimeout(animationTimeout);
        };
    }, [isAnimationResult, updateFinalResult]);

    return (
        <div className={styles.diceContainer}>
            <DiceList diceNumbers={diceNumbers} />
            <div className={styles['wrapper-total-dice']}>
                <TotalDiceNumber total={totalDiceNumber} language={language} settlementResult={settlementResult} />
            </div>
        </div>
    );
});

DiceDisplay.displayName = 'DiceDisplay';
