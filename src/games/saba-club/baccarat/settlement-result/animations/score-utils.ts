type CardResult = {
    card: number;
};

export const sumScore = (score: number, card: number): number => {
    return card + 1 >= 10 ? score : (score + card + 1) % 10;
};

export const calculatePlayerBankerScores = (result: any) => { // Replace any with proper Result type
    let playerScore = sumScore(0, result.player.card1.card);
    playerScore = sumScore(playerScore, result.player.card2.card);
    playerScore = sumScore(playerScore, result.player.card3?.card ?? -1);

    let bankerScore = sumScore(0, result.banker.card1.card);
    bankerScore = sumScore(bankerScore, result.banker.card2.card);
    bankerScore = sumScore(bankerScore, result.banker.card3?.card ?? -1);

    return { playerScore, bankerScore };
};

export const calculateTotalScore = (cards: (CardResult | undefined)[]): number => {
    return cards.reduce((score, card) => {
        if (!card) return score;
        return sumScore(score, card.card);
    }, 0);
}; 