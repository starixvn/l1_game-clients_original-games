import * as gc from '@sg/sg-game-client';

import { Result } from './baccarat';
import { sumScore } from './settlement-result/components/score-utils';

export const Choices = {
    banker: 'banker',
    player: 'player',
    tie: 'tie',
    bankerPair: 'bankerPair',
    playerPair: 'playerPair',
};

export const BaccaratConfigs = {
    choices: [
        {
            name: 'player',
            style: 'player',
            label: () => gc.Translator.t('Baccarat.glossary_player'),
        },
        {
            name: 'tie',
            style: 'tie',
            label: () => gc.Translator.t('Baccarat.glossary_tie'),
        },
        {
            name: 'banker',
            style: 'banker',
            label: () => gc.Translator.t('Baccarat.glossary_banker'),
        },
        {
            name: 'playerPair',
            style: 'player-pair',
            label: () => gc.Translator.t('Baccarat.glossary_playerPair'),
        },
        {
            name: 'bankerPair',
            style: 'bank-pair',
            label: () => gc.Translator.t('Baccarat.glossary_bankerPair'),
        },
    ],
};

export const StatisticRuleEntriesBankerPlayer = Object.entries({
    [Choices.player]: (countResult: object, total: number) =>
        countResult[Choices.player] ? Math.round((countResult[Choices.player] * 100) / total) : 0,
    [Choices.tie]: (countResult: object, total: number) =>
        countResult[Choices.tie] ? Math.round((countResult[Choices.tie] * 100) / total) : 0,
    [Choices.banker]: (countResult: object, total: number) =>
        100 -
        (countResult[Choices.player] ? Math.round((countResult[Choices.player] * 100) / total) : 0) -
        (countResult[Choices.tie] ? Math.round((countResult[Choices.tie] * 100) / total) : 0),
});

export const StatisticRuleMapping = [StatisticRuleEntriesBankerPlayer];

export const CardAnimationConfig = {
    baseDelay: 50,
    intervalDelay: 200,
    orders: {
        playerCard1: 1,
        bankerCard1: 2,
        playerCard2: 3,
        bankerCard2: 4,
        playerCard3: 5,
        bankerCard3: 6,
    },
    getAnimationTime: (order: number) => {
        const baseTime = 50;
        const cardInterval = 200;
        const pairDelay = 100;
        const thirdCardExtraDelay = 300; // Extra delay for third cards

        const pairIndex = Math.floor((order - 1) / 2);
        const positionInPair = (order - 1) % 2;
        const isThirdCard = order >= 5; // Check if it's a third card (order 5 or 6)

        return baseTime + pairIndex * (cardInterval + pairDelay) + positionInPair * cardInterval + (isThirdCard ? thirdCardExtraDelay : 0);
    },
};

export interface CardOrderWithTiming {
    value: any;
    order: number;
    animationDelay: number;
    accumulatedScore: number;
    playerHasThirdCard?: boolean;
}

export const GetPlayerCardsResult = (result: Result): CardOrderWithTiming[] => {
    const { orders, getAnimationTime } = CardAnimationConfig;
    let runningScore = 0;
    const hasThirdCard = !!result.player.card3;
    const playerCards = [
        {
            value: result.player.card2,
            order: orders.playerCard2,
            animationDelay: getAnimationTime(orders.playerCard2),
            accumulatedScore: (runningScore = sumScore(runningScore, result.player.card2.card)),
            playerHasThirdCard: hasThirdCard,
        },
        {
            value: result.player.card1,
            order: orders.playerCard1,
            animationDelay: getAnimationTime(orders.playerCard1),
            accumulatedScore: (runningScore = sumScore(0, result.player.card1.card)),
            playerHasThirdCard: hasThirdCard,
        },
    ];

    // Only add third card if it exists
    if (result.player.card3) {
        playerCards.push({
            value: result.player.card3,
            order: orders.playerCard3,
            animationDelay: getAnimationTime(orders.playerCard3),
            accumulatedScore: sumScore(runningScore, result.player.card3.card),
            playerHasThirdCard: hasThirdCard,
        });
    }

    return playerCards;
};

export const GetBankerCardsResult = (result: Result): CardOrderWithTiming[] => {
    const { orders, getAnimationTime } = CardAnimationConfig;
    let runningScore = 0;
    const hasThirdCard = !!result.player.card3;
    const bankerCards = [
        {
            value: result.banker.card1,
            order: orders.bankerCard1,
            animationDelay: getAnimationTime(orders.bankerCard1),
            accumulatedScore: (runningScore = sumScore(0, result.banker.card1.card)),
            playerHasThirdCard: hasThirdCard,
        },
        {
            value: result.banker.card2,
            order: orders.bankerCard2,
            animationDelay: getAnimationTime(orders.bankerCard2),
            accumulatedScore: (runningScore = sumScore(runningScore, result.banker.card2.card)),
            playerHasThirdCard: hasThirdCard,
        },
    ];

    // Only add third card if it exists
    if (result.banker.card3) {
        bankerCards.push({
            value: result.banker.card3,
            order: hasThirdCard ? orders.bankerCard3 : orders.playerCard3,
            animationDelay: getAnimationTime(hasThirdCard ? orders.bankerCard3 : orders.playerCard3),
            accumulatedScore: sumScore(runningScore, result.banker.card3.card),
            playerHasThirdCard: hasThirdCard,
        });
    }

    return bankerCards;
};

export const GetTranslateChoiceMapping = (gameName = 'Baccarat') => {
    return {
        player: gc.Translator.t(`${gameName}.glossary_player`),
        banker: gc.Translator.t(`${gameName}.glossary_banker`),
        tie: gc.Translator.t(`${gameName}.glossary_tie`),
        playerPair: gc.Translator.t(`${gameName}.glossary_playerPair`),
        bankerPair: gc.Translator.t(`${gameName}.glossary_bankerPair`),
    };
};

export const ChoiceForTabActive = [
    {
        choice: ['banker', 'player', 'tie'],
    },
];
