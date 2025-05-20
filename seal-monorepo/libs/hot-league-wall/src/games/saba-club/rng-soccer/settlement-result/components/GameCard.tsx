import React from 'react';
import styles from '../../rng-soccer.module.scss';
import Styles from '../styles/rng-soccer-settlement.module.scss';
import cardBack from '../../../../../assets/rng-soccer/cards/card-back.svg';
import { CardUtils } from '../utils/CardUtils';

export interface CardData {
    card: number;
    type: number;
}

interface GameCardProps {
    cardData?: CardData;
    isHomeCard?: boolean;
    isHidden?: boolean;
    isAnimating?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
    cardData,
    isHomeCard = true,
    isHidden = false,
    isAnimating = false
}) => {
    // If no data or hiding cards, show card back
    if (!cardData || isHidden || !cardData.card) {
        return (
            <div className={styles['card-section']}>
                <img src={cardBack} alt="card" />
            </div>
        );
    }

    // Get the actual card image
    const cardImage = CardUtils.getCardImage(cardData.card, cardData.type);

    return (
        <div className={styles['card-section']}>
            <img
                src={cardImage}
                alt={`${isHomeCard ? 'home' : 'away'}-card`}
                className={`${isAnimating ? Styles['card-flip'] : ''}`}
            />
        </div>
    );
};

export default GameCard; 