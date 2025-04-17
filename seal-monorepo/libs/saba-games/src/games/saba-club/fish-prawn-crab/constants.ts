export const constants = {
    resultMapper: { stag: 0, gourd: 1, rooster: 2, fish: 3, crab: 4, prawn: 5 },
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