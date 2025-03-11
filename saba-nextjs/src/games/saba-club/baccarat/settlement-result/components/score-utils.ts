type CardResult = {
    card: number;
};

export const sumScore = (score: number, card: number): number => {
    return card + 1 >= 10 ? score : (score + card + 1) % 10;
};

export const calculateTotalScore = (cards: (CardResult | undefined)[]): number => {
    return cards.reduce((score, card) => {
        if (!card) return score;
        return sumScore(score, card.card);
    }, 0);
}; 