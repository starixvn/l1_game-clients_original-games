import { CardType } from "../../baccarat";

export const sumScore = (score: number, card: number): number => {
    const cardValue = card >= 9 ? 0 : card + 1;
    const newScore = (score + cardValue) % 10;
    return newScore;
};

export const calculateTotalScore = (cards: number[]): number => {
    if (!cards || cards.length === 0) {
        throw new Error('Cards array cannot be empty');
    }

    if (cards.some(card => card < 0 || card > 12)) {
        throw new Error('Card values must be between 0 and 12');
    }

    return cards.reduce((score, card) => sumScore(score, card), 0);
};

export const getCardValues = (cards: (CardType | undefined)[]): number[] => {
    const validCards = cards.filter((card): card is CardType => card !== undefined);
    return validCards.map(card => card.card);
};

export const determineWinner = (playerScore: number, bankerScore: number): string => {
    if (playerScore > bankerScore) {
        return 'player_win';
    } else if (bankerScore > playerScore) {
        return 'banker_win';
    } else {
        return 'tie_win';
    }
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
