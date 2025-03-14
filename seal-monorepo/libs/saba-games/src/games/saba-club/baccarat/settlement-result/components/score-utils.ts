export type CardResult = {
    card: number;
};

export const sumScore = (score: number, card: number): number => {
    const cardValue = card >= 9 ? 0 : card + 1;
    return (score + cardValue) % 10;
};

export const calculateTotalScore = (cards: (CardResult | undefined)[]): number => {
    if (!cards || cards.length === 0) {
        throw new Error('Cards array cannot be empty');
    }

    // Filter out undefined cards and get their values
    const cardValues = cards.filter((card): card is CardResult => card !== undefined)
        .map(card => card.card);

    if (cardValues.length === 0) {
        throw new Error('No valid cards provided');
    }

    if (cardValues.some(card => card < 0 || card > 12)) {
        throw new Error('Card values must be between 0 and 12');
    }

    return cardValues.reduce((score, card) => sumScore(score, card), 0);
};