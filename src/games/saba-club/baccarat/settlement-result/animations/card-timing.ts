export interface CardTiming {
    time: number;
    card: any; // Replace with proper card type
    isBanker: boolean;
}

export const getCardOpeningSequence = (result: any): CardTiming[] => { // Replace any with proper Result type
    return [
        // First pair - Player card 1 and Banker card 1 (immediate)
        { time: 0, card: result.player.card1, isBanker: false },
        { time: 0, card: result.banker.card1, isBanker: true },

        // Second pair - Player card 2 and Banker card 2 (700ms delay)
        { time: 300, card: result.player.card2, isBanker: false },
        { time: 300, card: result.banker.card2, isBanker: true },

        // Third cards remain sequential with adjusted timing
        {
            time: 1400,
            card: result.player.card3 ?? result.banker.card3,
            isBanker: !result.player.card3,
        },
        {
            time: 2100,
            card: !!result.player.card3 ? result.banker.card3 : null,
            isBanker: true
        },
    ];
} 