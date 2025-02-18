export interface CardTiming {
    time: number;
    card: any; // Replace with proper card type
    isBanker: boolean;
}

export const getCardOpeningSequence = (result: any): CardTiming[] => { // Replace any with proper Result type
    return [
        { time: 700, card: result.player.card1, isBanker: false },
        { time: 1500, card: result.banker.card1, isBanker: true },
        { time: 2300, card: result.player.card2, isBanker: false },
        { time: 3100, card: result.banker.card2, isBanker: true },
        {
            time: 4400,
            card: result.player.card3 ?? result.banker.card3,
            isBanker: !result.player.card3,
        },
        {
            time: 5800,
            card: !!result.player.card3 ? result.banker.card3 : null,
            isBanker: true
        },
    ];
} 