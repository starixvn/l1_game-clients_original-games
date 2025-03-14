import { CardType } from "../../baccarat";

export const sumScore = (score: number, card: number): number => {
    console.log('Calculating sum score:', { currentScore: score, newCard: card });

    // if (card < 0 || card > 12) {
    //     console.error('Invalid card value:', card);
    //     throw new Error(`Card value must be between 0 and 12, got ${card}`);
    // }

    // if (score < 0 || score > 9) {
    //     console.error('Invalid current score:', score);
    //     throw new Error(`Current score must be between 0 and 9, got ${score}`);
    // }

    // In Baccarat:
    // - Ace (0) = 1
    // - 2-9 (1-8) = face value + 1
    // - 10, J, Q, K (9-12) = 0
    const cardValue = card >= 9 ? 0 : card + 1;
    const newScore = (score + cardValue) % 10;

    console.log('Sum score result:', {
        currentScore: score,
        cardValue,
        newScore,
        calculation: `(${score} + ${cardValue}) % 10 = ${newScore}`
    });

    return newScore;
};

export const calculateTotalScore = (cards: number[]): number => {
    console.log('Calculating total score for cards:', cards);

    if (!cards || cards.length === 0) {
        console.error('Invalid cards array:', { cards });
        throw new Error('Cards array cannot be empty');
    }

    if (cards.some(card => card < 0 || card > 12)) {
        console.error('Invalid card values:', { cards });
        throw new Error('Card values must be between 0 and 12');
    }

    const totalScore = cards.reduce((score, card) => sumScore(score, card), 0);
    console.log('Total score calculated:', { cards, totalScore });
    return totalScore;
};

export const getCardValues = (cards: (CardType | undefined)[]): number[] => {
    console.log('Getting card values from:', cards);
    const validCards = cards.filter((card): card is CardType => card !== undefined);
    const cardValues = validCards.map(card => card.card);
    console.log('Extracted card values:', { originalCards: cards, validCards, cardValues });
    return cardValues;
};

export const determineWinner = (playerScore: number, bankerScore: number): string => {
    console.log('Determining winner:', { playerScore, bankerScore });
    let result: string;
    if (playerScore > bankerScore) {
        result = 'player_win';
    } else if (bankerScore > playerScore) {
        result = 'banker_win';
    } else {
        result = 'tie_win';
    }
    console.log('Winner determined:', { result, playerScore, bankerScore });
    return result;
};

export interface Result {
    player?: {
        card1?: CardType;
        card2?: CardType;
        card3?: CardType;
    };
    banker?: {
        card1?: CardType;
        card2?: CardType;
        card3?: CardType;
    };
}
