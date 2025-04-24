import { ColorGameSymbol } from 'libs/saba-games/src/_shared/components/color-game-dice';
import { resultMapper } from './color-game-utils';

export const constants = {
    resultMapper,
    oddMapper: { 1: "single", 2: "double", 3: "triple" },
};

export const MockRoundHistoryItem = {
    "roundId": 2786845,
    "result": {
        "dice1": 1,
        "dice2": 1,
        "dice3": 2
    },
    "settlementResult": {
        "yellow": false,
        "red": true,
        "pink": true,
        "white": false,
        "blue": false,
        "green": false
    }
};

export const blinkRoundItem = {
    "dice1": ColorGameSymbol.RESULT,
    "dice2": ColorGameSymbol.RESULT,
    "dice3": ColorGameSymbol.RESULT
}


export const emptyRoundItem = {
    "dice1": ColorGameSymbol.EMPTY,
    "dice2": ColorGameSymbol.EMPTY,
    "dice3": ColorGameSymbol.EMPTY
}

