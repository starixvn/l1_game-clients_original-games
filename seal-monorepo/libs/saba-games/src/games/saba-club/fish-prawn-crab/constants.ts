import { resultMapper } from './fish-prawn-crab-utils';

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
        "stag": false,
        "gourd": true,
        "rooster": true,
        "fish": false,
        "crab": false,
        "prawn": false
    }
};