import React, { useCallback, useEffect, useState } from 'react';

import { CardOrder } from '../../baccarat';
import { CardOrderWithTiming } from '../../baccarat-helper';
import Styles from '../styles/baccarat-animations.module.scss';
import { BaccaratCard } from './baccarat-card';
import { ScoreDisplay } from './score-display';

interface CardSectionProps {
    cards: CardOrderWithTiming[];
    label: string;
    type: 'player' | 'banker';
    playResultAnimation: boolean;
    isShowResult: boolean;
}

export const CardSection: React.FC<CardSectionProps> = ({ cards, label, type, playResultAnimation, isShowResult }) => {
    const [visibleScores, setVisibleScores] = useState<{ [key: number]: boolean }>({});

    // Reset states when show result changes
    useEffect(() => {
        if (!isShowResult) {
            setVisibleScores({});
        }
    }, [isShowResult]);

    const handleCardFlip = useCallback(
        (card: CardOrder, accumulatedScore: number) => {
            // Add delay to match card flip animation completion
            setTimeout(() => {
                setVisibleScores((prev) => ({
                    ...prev,
                    [card.order]: true,
                }));
            }, 600); // Match the animation duration from BaccaratCard
        },
        [type],
    );

    return (
        <div className={Styles.cardSection} style={{ height: '100%' }}>
            <div className={`${Styles.label} ${type === 'player' ? Styles['label-player'] : Styles['label-banker']}`}>{label}</div>
            <div className={`${Styles.cardContainer} ${Styles[type]} ${!playResultAnimation ? Styles['move-up-no-animation'] : ''}`}>
                {(type === 'player' ? [...cards].reverse() : cards).map((card, index) => (
                    <BaccaratCard key={card.order} card={card} isShowResult={isShowResult} onCardFlip={handleCardFlip} />
                ))}

                {isShowResult &&
                    cards.map((card, index) => (
                        <div key={card.order}>
                            <ScoreDisplay
                                score={card.accumulatedScore}
                                cardsCount={index + 1}
                                type={type}
                                visible={visibleScores[card.order]}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};
