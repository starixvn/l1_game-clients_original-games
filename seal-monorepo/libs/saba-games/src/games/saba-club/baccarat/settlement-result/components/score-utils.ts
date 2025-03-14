import { CardType } from "../../baccarat";

export const sumScore = (score: number, card: number): number => {
    const cardValue = card >= 9 ? 0 : card + 1;
    return (score + cardValue) % 10;
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
    return cards
        .filter((card): card is CardType => card !== undefined)
        .map(card => card.card);
};

export const determineWinner = (playerScore: number, bankerScore: number): string => {
    if (playerScore > bankerScore) return 'player_win';
    if (bankerScore > playerScore) return 'banker_win';
    return 'tie_win';
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
    const playerCards = getCardValues([result.player?.card1, result.player?.card2, result.player?.card3]);
    const bankerCards = getCardValues([result.banker?.card1, result.banker?.card2, result.banker?.card3]);

    if (playerCards.length === 0 || bankerCards.length === 0) {
        return null;
    }

    return {
        playerScore: calculateTotalScore(playerCards),
        bankerScore: calculateTotalScore(bankerCards)
    };
};

