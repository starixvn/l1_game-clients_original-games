import { CardType } from "../../baccarat";

export const sumScore = (score: number, card: number): number => {
    console.log('Calculating sum score:', { currentScore: score, newCard: card });
    const cardValue = card >= 9 ? 0 : card + 1;
    const newScore = (score + cardValue) % 10;
    console.log('Sum score result:', { cardValue, newScore });
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

export const calculateScores = (result: Result): { playerScore: number; bankerScore: number } | null => {
    console.log('Calculating scores for result:', {
        playerCards: result.player,
        bankerCards: result.banker
    });

    const playerCards = getCardValues([result.player?.card1, result.player?.card2, result.player?.card3]);
    const bankerCards = getCardValues([result.banker?.card1, result.banker?.card2, result.banker?.card3]);

    console.log('Card values extracted:', {
        playerCards,
        bankerCards,
        playerCardsCount: playerCards.length,
        bankerCardsCount: bankerCards.length
    });

    if (playerCards.length === 0 || bankerCards.length === 0) {
        console.warn('Invalid card count detected:', {
            playerCardsCount: playerCards.length,
            bankerCardsCount: bankerCards.length
        });
        return null;
    }

    const scores = {
        playerScore: calculateTotalScore(playerCards),
        bankerScore: calculateTotalScore(bankerCards)
    };

    console.log('Final scores calculated:', scores);
    return scores;
};

