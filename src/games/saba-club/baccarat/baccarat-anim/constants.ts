import type { Result } from "../baccarat";
import * as gc from "@sg/sg-game-client";

export const TEXTS = {
    player: 'Player',
    banker: 'Banker',
} as const;

export interface BaccaratScenario extends Result {
    label: string;
    description: string;
    category: 'natural' | 'three_cards' | 'pairs';
    winner?: 'player' | 'banker' | 'tie';
    visible?: boolean;
}

export const BACCARAT_SCENARIOS: ReadonlyArray<BaccaratScenario> = [
    {
        label: 'Natural 9 vs 8',
        description: 'Player has Natural 8 (3♣+5♦=8) vs Banker Natural 9 (4♠+5♥=9). Both hands are Natural (2 cards).',
        category: 'natural',
        winner: 'banker',
        visible: true,
        banker: { card1: { card: 3, type: 0 }, card2: { card: 4, type: 1 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 4, type: 3 } },
    },
    {
        label: 'Natural 8 vs Natural 9',
        description: 'Player has Natural 9 (5♣+4♦=9) vs Banker Natural 8 (4♠+4♥=8). Both hands are Natural (2 cards).',
        category: 'natural',
        winner: 'player',
        visible: true,
        banker: { card1: { card: 3, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 4, type: 2 }, card2: { card: 3, type: 3 } },
    },
    {
        label: 'Natural Tie (Both 8)',
        description: 'Player has Natural 8 (3♣+5♦=8) vs Banker Natural 8 (4♠+4♥=8). Both hands are Natural (2 cards).',
        category: 'natural',
        winner: 'tie',
        visible: true,
        banker: { card1: { card: 3, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 4, type: 3 } },
    },
    {
        label: 'Perfect Pair - Banker',
        description: 'Player has (3♣+4♦=7) vs Banker Perfect Pair (4♠+4♠=8). Banker wins with Perfect Pair paying special odds.',
        category: 'pairs',
        winner: 'banker',
        visible: true,
        banker: { card1: { card: 3, type: 0 }, card2: { card: 3, type: 0 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 3 } },
    },
    {
        label: 'Perfect Pair - Player',
        description: 'Player has Perfect Pair (4♣+4♣=8) vs Banker (3♠+4♥=7). Player wins with Perfect Pair paying special odds.',
        category: 'pairs',
        winner: 'player',
        visible: true,
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 3, type: 2 }, card2: { card: 3, type: 2 } },
    },
    {
        label: 'Both Perfect Pairs',
        description: 'Player has Perfect Pair (3♣+3♣=6) vs Banker Perfect Pair (4♠+4♠=8). Both Perfect Pairs pay special odds.',
        category: 'pairs',
        winner: 'banker',
        visible: true,
        banker: { card1: { card: 3, type: 0 }, card2: { card: 3, type: 0 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 2, type: 2 } },
    },
    {
        label: 'Super 6',
        description: 'Player has (2♣+3♦=5) vs Banker (3♠+3♥=6). Banker wins with Super 6 paying special odds.',
        category: 'three_cards',
        winner: 'banker',
        visible: false,
        banker: { card1: { card: 2, type: 0 }, card2: { card: 2, type: 1 } },
        player: { card1: { card: 1, type: 2 }, card2: { card: 2, type: 3 } },
    },
    {
        label: 'Dragon Bonus - Natural Win',
        description: 'Player has (3♣+4♦=7) vs Banker Natural 9 (4♠+5♥=9). Natural win by 2 points qualifies for Dragon Bonus.',
        category: 'natural',
        winner: 'banker',
        visible: false,
        banker: { card1: { card: 3, type: 0 }, card2: { card: 4, type: 1 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 3 } },
    },
    {
        label: 'Dragon Bonus - Non-Natural Win',
        description: 'Player has Natural 9 (9♦+J♠=9) vs Banker three cards (4♠+5♥+A♣=0). 9-point win pays Dragon Bonus.',
        category: 'three_cards',
        winner: 'player',
        visible: false,
        banker: { card1: { card: 3, type: 0 }, card2: { card: 4, type: 1 }, card3: { card: 0, type: 2 } },
        player: { card1: { card: 8, type: 3 }, card2: { card: 10, type: 0 } },
    },
    {
        label: 'Banker 3 Cards vs Player 2',
        description: 'Player has two cards (3♦+4♠=7) vs Banker three cards (2♠+3♥+3♣=8). Shows Banker drawing rules.',
        category: 'three_cards',
        winner: 'banker',
        visible: true,
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 2, type: 3 }, card2: { card: 3, type: 0 } },
    },
    {
        label: 'Player 3 Cards vs Banker 2',
        description: 'Player draws third card (2♣+3♦+5♠=0) vs Banker two cards (3♠+4♥=7). Shows Player drawing first.',
        category: 'three_cards',
        winner: 'banker',
        visible: true,
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 1, type: 2 }, card2: { card: 2, type: 3 }, card3: { card: 4, type: 0 } },
    },
    {
        label: 'Both 3 Cards - Player Wins',
        description: 'Player three cards (3♣+4♦+4♠=1) wins vs Banker three cards (2♠+3♥+3♣=8). Shows complete drawing rules.',
        category: 'three_cards',
        winner: 'player',
        visible: true,
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 3 }, card3: { card: 3, type: 0 } },
    },
    {
        label: 'Both 3 Cards - Banker Wins',
        description: 'Player three cards (2♣+3♦+2♥=7) vs Banker three cards (3♠+4♥+3♣=0). Shows complete drawing rules.',
        category: 'three_cards',
        winner: 'banker',
        visible: true,
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 1, type: 2 }, card2: { card: 2, type: 3 }, card3: { card: 1, type: 1 } },
    },
    {
        label: 'Both 3 Cards - Tie',
        description: 'Player three cards (3♣+4♦+2♠=8) ties with Banker three cards (2♠+3♥+3♣=8). Rare three-card tie scenario.',
        category: 'three_cards',
        winner: 'tie',
        visible: true,
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 3 }, card3: { card: 1, type: 0 } },
    },
    {
        label: 'Multiple Pairs with 3 Cards',
        description: 'Player has pair (4♦+4♠+2♥=0) vs Banker three of a kind (3♠+3♥+3♣=9). Shows multiple pair combinations.',
        category: 'pairs',
        winner: 'banker',
        visible: true,
        banker: { card1: { card: 2, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 3, type: 3 }, card2: { card: 3, type: 0 }, card3: { card: 1, type: 1 } },
    },
    {
        label: 'Dragon 7',
        description: 'Player has (3♦+4♠=6) vs Banker three cards (2♠+3♥+3♣=7). Banker Dragon 7 pays special odds.',
        category: 'three_cards',
        winner: 'banker',
        visible: false,
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 2, type: 3 }, card2: { card: 3, type: 0 } },
    },
    {
        label: 'Panda 8',
        description: 'Player three cards (2♣+3♦+4♠=8) vs Banker (3♠+4♥=7). Player Panda 8 pays special odds.',
        category: 'three_cards',
        winner: 'player',
        visible: false,
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 1, type: 2 }, card2: { card: 2, type: 3 }, card3: { card: 3, type: 0 } },
    },
    {
        label: 'Natural Tie 9',
        description: 'Player Natural 9 (5♣+4♦=9) ties with Banker Natural 9 (4♠+5♥=9). Highest possible Natural tie.',
        category: 'natural',
        winner: 'tie',
        visible: true,
        banker: { card1: { card: 3, type: 0 }, card2: { card: 4, type: 1 } },
        player: { card1: { card: 4, type: 2 }, card2: { card: 3, type: 3 } },
    }
] as const;

export const RoundHistory: gc.RoundHistories.RoundHistory[] =
    [
        {
            "roundId": 2127848,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 0
                    },
                    "card2": {
                        "card": 0,
                        "type": 3
                    },
                    "card3": {
                        "card": 11,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 5,
                        "type": 0
                    },
                    "card2": {
                        "card": 6,
                        "type": 2
                    },
                    "card3": {
                        "card": 11,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": true,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127847,
            "result": {
                "player": {
                    "card1": {
                        "card": 8,
                        "type": 2
                    },
                    "card2": {
                        "card": 0,
                        "type": 2
                    },
                    "card3": {
                        "card": 6,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 3
                    },
                    "card2": {
                        "card": 7,
                        "type": 2
                    },
                    "card3": {
                        "card": 0,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127846,
            "result": {
                "player": {
                    "card1": {
                        "card": 2,
                        "type": 2
                    },
                    "card2": {
                        "card": 9,
                        "type": 0
                    },
                    "card3": {
                        "card": 7,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 8,
                        "type": 3
                    },
                    "card2": {
                        "card": 3,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127845,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 0
                    },
                    "card2": {
                        "card": 3,
                        "type": 1
                    },
                    "card3": {
                        "card": 11,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 2
                    },
                    "card2": {
                        "card": 0,
                        "type": 3
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127844,
            "result": {
                "player": {
                    "card1": {
                        "card": 11,
                        "type": 0
                    },
                    "card2": {
                        "card": 11,
                        "type": 2
                    },
                    "card3": {
                        "card": 7,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 0
                    },
                    "card2": {
                        "card": 10,
                        "type": 1
                    },
                    "card3": {
                        "card": 0,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": true,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127843,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 3
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": {
                        "card": 1,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 0,
                        "type": 3
                    },
                    "card2": {
                        "card": 5,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127842,
            "result": {
                "player": {
                    "card1": {
                        "card": 3,
                        "type": 1
                    },
                    "card2": {
                        "card": 0,
                        "type": 1
                    },
                    "card3": {
                        "card": 4,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 1,
                        "type": 1
                    },
                    "card3": {
                        "card": 8,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127841,
            "result": {
                "player": {
                    "card1": {
                        "card": 3,
                        "type": 2
                    },
                    "card2": {
                        "card": 3,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 2
                    },
                    "card2": {
                        "card": 0,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": true,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127840,
            "result": {
                "player": {
                    "card1": {
                        "card": 11,
                        "type": 0
                    },
                    "card2": {
                        "card": 2,
                        "type": 3
                    },
                    "card3": {
                        "card": 0,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 10,
                        "type": 1
                    },
                    "card2": {
                        "card": 12,
                        "type": 3
                    },
                    "card3": {
                        "card": 3,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": true,
                "small": false,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127839,
            "result": {
                "player": {
                    "card1": {
                        "card": 2,
                        "type": 2
                    },
                    "card2": {
                        "card": 5,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 10,
                        "type": 2
                    },
                    "card2": {
                        "card": 7,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127838,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 1
                    },
                    "card2": {
                        "card": 10,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 0,
                        "type": 3
                    },
                    "card2": {
                        "card": 7,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127837,
            "result": {
                "player": {
                    "card1": {
                        "card": 11,
                        "type": 2
                    },
                    "card2": {
                        "card": 6,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 1
                    },
                    "card2": {
                        "card": 7,
                        "type": 2
                    },
                    "card3": {
                        "card": 1,
                        "type": 2
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127836,
            "result": {
                "player": {
                    "card1": {
                        "card": 2,
                        "type": 1
                    },
                    "card2": {
                        "card": 8,
                        "type": 3
                    },
                    "card3": {
                        "card": 7,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 3
                    },
                    "card2": {
                        "card": 7,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": true,
                "natural": false
            }
        },
        {
            "roundId": 2127835,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 0
                    },
                    "card2": {
                        "card": 11,
                        "type": 2
                    },
                    "card3": {
                        "card": 11,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 8,
                        "type": 1
                    },
                    "card2": {
                        "card": 1,
                        "type": 3
                    },
                    "card3": {
                        "card": 10,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": true,
                "small": false,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127834,
            "result": {
                "player": {
                    "card1": {
                        "card": 4,
                        "type": 0
                    },
                    "card2": {
                        "card": 9,
                        "type": 3
                    },
                    "card3": {
                        "card": 8,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 2
                    },
                    "card2": {
                        "card": 9,
                        "type": 1
                    },
                    "card3": {
                        "card": 6,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127833,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 1
                    },
                    "card2": {
                        "card": 8,
                        "type": 3
                    },
                    "card3": {
                        "card": 11,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 12,
                        "type": 2
                    },
                    "card2": {
                        "card": 0,
                        "type": 1
                    },
                    "card3": {
                        "card": 2,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127832,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 1
                    },
                    "card2": {
                        "card": 12,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 10,
                        "type": 3
                    },
                    "card2": {
                        "card": 2,
                        "type": 3
                    },
                    "card3": {
                        "card": 1,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127831,
            "result": {
                "player": {
                    "card1": {
                        "card": 8,
                        "type": 3
                    },
                    "card2": {
                        "card": 7,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 3
                    },
                    "card2": {
                        "card": 6,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": false,
                "small": true,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127830,
            "result": {
                "player": {
                    "card1": {
                        "card": 3,
                        "type": 0
                    },
                    "card2": {
                        "card": 4,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 0,
                        "type": 2
                    },
                    "card2": {
                        "card": 4,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127829,
            "result": {
                "player": {
                    "card1": {
                        "card": 8,
                        "type": 1
                    },
                    "card2": {
                        "card": 1,
                        "type": 0
                    },
                    "card3": {
                        "card": 6,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 5,
                        "type": 1
                    },
                    "card2": {
                        "card": 3,
                        "type": 1
                    },
                    "card3": {
                        "card": 2,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127828,
            "result": {
                "player": {
                    "card1": {
                        "card": 10,
                        "type": 2
                    },
                    "card2": {
                        "card": 7,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 9,
                        "type": 1
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127827,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 2
                    },
                    "card2": {
                        "card": 12,
                        "type": 0
                    },
                    "card3": {
                        "card": 11,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 12,
                        "type": 3
                    },
                    "card2": {
                        "card": 4,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127826,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 0
                    },
                    "card2": {
                        "card": 11,
                        "type": 0
                    },
                    "card3": {
                        "card": 5,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 10,
                        "type": 1
                    },
                    "card2": {
                        "card": 12,
                        "type": 0
                    },
                    "card3": {
                        "card": 1,
                        "type": 2
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127825,
            "result": {
                "player": {
                    "card1": {
                        "card": 6,
                        "type": 0
                    },
                    "card2": {
                        "card": 8,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 2
                    },
                    "card2": {
                        "card": 4,
                        "type": 3
                    },
                    "card3": {
                        "card": 3,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127824,
            "result": {
                "player": {
                    "card1": {
                        "card": 8,
                        "type": 3
                    },
                    "card2": {
                        "card": 0,
                        "type": 1
                    },
                    "card3": {
                        "card": 0,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 2
                    },
                    "card2": {
                        "card": 3,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127823,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 3
                    },
                    "card2": {
                        "card": 10,
                        "type": 0
                    },
                    "card3": {
                        "card": 2,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 2
                    },
                    "card2": {
                        "card": 1,
                        "type": 3
                    },
                    "card3": {
                        "card": 0,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127822,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 3
                    },
                    "card2": {
                        "card": 11,
                        "type": 3
                    },
                    "card3": {
                        "card": 12,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 2
                    },
                    "card2": {
                        "card": 6,
                        "type": 0
                    },
                    "card3": {
                        "card": 6,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127821,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 3
                    },
                    "card2": {
                        "card": 6,
                        "type": 1
                    },
                    "card3": {
                        "card": 6,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 1
                    },
                    "card2": {
                        "card": 5,
                        "type": 1
                    },
                    "card3": {
                        "card": 2,
                        "type": 2
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127820,
            "result": {
                "player": {
                    "card1": {
                        "card": 7,
                        "type": 1
                    },
                    "card2": {
                        "card": 4,
                        "type": 2
                    },
                    "card3": {
                        "card": 3,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 8,
                        "type": 3
                    },
                    "card2": {
                        "card": 2,
                        "type": 2
                    },
                    "card3": {
                        "card": 10,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127819,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 0
                    },
                    "card2": {
                        "card": 0,
                        "type": 2
                    },
                    "card3": {
                        "card": 11,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 3
                    },
                    "card2": {
                        "card": 8,
                        "type": 0
                    },
                    "card3": {
                        "card": 1,
                        "type": 2
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127818,
            "result": {
                "player": {
                    "card1": {
                        "card": 4,
                        "type": 2
                    },
                    "card2": {
                        "card": 11,
                        "type": 3
                    },
                    "card3": {
                        "card": 2,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 8,
                        "type": 3
                    },
                    "card2": {
                        "card": 2,
                        "type": 3
                    },
                    "card3": {
                        "card": 12,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127817,
            "result": {
                "player": {
                    "card1": {
                        "card": 4,
                        "type": 2
                    },
                    "card2": {
                        "card": 1,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 9,
                        "type": 0
                    },
                    "card2": {
                        "card": 5,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127816,
            "result": {
                "player": {
                    "card1": {
                        "card": 10,
                        "type": 2
                    },
                    "card2": {
                        "card": 1,
                        "type": 2
                    },
                    "card3": {
                        "card": 2,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 3
                    },
                    "card2": {
                        "card": 0,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": true,
                "small": false,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127815,
            "result": {
                "player": {
                    "card1": {
                        "card": 8,
                        "type": 0
                    },
                    "card2": {
                        "card": 2,
                        "type": 2
                    },
                    "card3": {
                        "card": 9,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 0
                    },
                    "card2": {
                        "card": 12,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127814,
            "result": {
                "player": {
                    "card1": {
                        "card": 10,
                        "type": 0
                    },
                    "card2": {
                        "card": 4,
                        "type": 2
                    },
                    "card3": {
                        "card": 4,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 2
                    },
                    "card2": {
                        "card": 10,
                        "type": 2
                    },
                    "card3": {
                        "card": 3,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127813,
            "result": {
                "player": {
                    "card1": {
                        "card": 11,
                        "type": 0
                    },
                    "card2": {
                        "card": 8,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 3
                    },
                    "card2": {
                        "card": 5,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127812,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 1
                    },
                    "card2": {
                        "card": 11,
                        "type": 3
                    },
                    "card3": {
                        "card": 1,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 10,
                        "type": 1
                    },
                    "card2": {
                        "card": 1,
                        "type": 2
                    },
                    "card3": {
                        "card": 6,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127811,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 2
                    },
                    "card2": {
                        "card": 6,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 6,
                        "type": 3
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127810,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 3
                    },
                    "card2": {
                        "card": 3,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 5,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127809,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 2
                    },
                    "card2": {
                        "card": 2,
                        "type": 0
                    },
                    "card3": {
                        "card": 6,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 3
                    },
                    "card2": {
                        "card": 2,
                        "type": 1
                    },
                    "card3": {
                        "card": 7,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": true,
                "small": false,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127808,
            "result": {
                "player": {
                    "card1": {
                        "card": 10,
                        "type": 1
                    },
                    "card2": {
                        "card": 5,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 9,
                        "type": 3
                    },
                    "card2": {
                        "card": 11,
                        "type": 2
                    },
                    "card3": {
                        "card": 9,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127807,
            "result": {
                "player": {
                    "card1": {
                        "card": 11,
                        "type": 3
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": {
                        "card": 9,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 1,
                        "type": 3
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127806,
            "result": {
                "player": {
                    "card1": {
                        "card": 11,
                        "type": 2
                    },
                    "card2": {
                        "card": 2,
                        "type": 0
                    },
                    "card3": {
                        "card": 0,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 1
                    },
                    "card2": {
                        "card": 7,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": true,
                "natural": false
            }
        },
        {
            "roundId": 2127805,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 1
                    },
                    "card2": {
                        "card": 12,
                        "type": 2
                    },
                    "card3": {
                        "card": 2,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 3
                    },
                    "card2": {
                        "card": 7,
                        "type": 0
                    },
                    "card3": {
                        "card": 1,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127804,
            "result": {
                "player": {
                    "card1": {
                        "card": 2,
                        "type": 2
                    },
                    "card2": {
                        "card": 6,
                        "type": 0
                    },
                    "card3": {
                        "card": 1,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 8,
                        "type": 3
                    },
                    "card3": {
                        "card": 11,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": true,
                "small": false,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127803,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 1
                    },
                    "card2": {
                        "card": 5,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 0
                    },
                    "card2": {
                        "card": 0,
                        "type": 3
                    },
                    "card3": {
                        "card": 1,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127802,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 2
                    },
                    "card2": {
                        "card": 8,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 0
                    },
                    "card2": {
                        "card": 5,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127801,
            "result": {
                "player": {
                    "card1": {
                        "card": 6,
                        "type": 2
                    },
                    "card2": {
                        "card": 8,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 1
                    },
                    "card2": {
                        "card": 0,
                        "type": 2
                    },
                    "card3": {
                        "card": 10,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127800,
            "result": {
                "player": {
                    "card1": {
                        "card": 6,
                        "type": 2
                    },
                    "card2": {
                        "card": 11,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 5,
                        "type": 2
                    },
                    "card2": {
                        "card": 4,
                        "type": 3
                    },
                    "card3": {
                        "card": 4,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127799,
            "result": {
                "player": {
                    "card1": {
                        "card": 2,
                        "type": 3
                    },
                    "card2": {
                        "card": 8,
                        "type": 1
                    },
                    "card3": {
                        "card": 9,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 2
                    },
                    "card2": {
                        "card": 1,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127798,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 0
                    },
                    "card2": {
                        "card": 6,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 0
                    },
                    "card2": {
                        "card": 10,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127797,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 0
                    },
                    "card2": {
                        "card": 10,
                        "type": 1
                    },
                    "card3": {
                        "card": 12,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 9,
                        "type": 3
                    },
                    "card2": {
                        "card": 1,
                        "type": 1
                    },
                    "card3": {
                        "card": 7,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": true,
                "small": false,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127796,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 1
                    },
                    "card2": {
                        "card": 8,
                        "type": 1
                    },
                    "card3": {
                        "card": 0,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 0,
                        "type": 3
                    },
                    "card2": {
                        "card": 8,
                        "type": 2
                    },
                    "card3": {
                        "card": 2,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127795,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 1
                    },
                    "card2": {
                        "card": 0,
                        "type": 3
                    },
                    "card3": {
                        "card": 8,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 3
                    },
                    "card2": {
                        "card": 10,
                        "type": 1
                    },
                    "card3": {
                        "card": 1,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127794,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 0
                    },
                    "card2": {
                        "card": 9,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 3
                    },
                    "card2": {
                        "card": 2,
                        "type": 3
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127793,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 1
                    },
                    "card2": {
                        "card": 12,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 0
                    },
                    "card2": {
                        "card": 4,
                        "type": 3
                    },
                    "card3": {
                        "card": 6,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": true,
                "natural": false
            }
        },
        {
            "roundId": 2127792,
            "result": {
                "player": {
                    "card1": {
                        "card": 4,
                        "type": 2
                    },
                    "card2": {
                        "card": 4,
                        "type": 1
                    },
                    "card3": {
                        "card": 1,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 0
                    },
                    "card2": {
                        "card": 8,
                        "type": 3
                    },
                    "card3": {
                        "card": 0,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": true,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127791,
            "result": {
                "player": {
                    "card1": {
                        "card": 3,
                        "type": 0
                    },
                    "card2": {
                        "card": 1,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 2
                    },
                    "card2": {
                        "card": 9,
                        "type": 0
                    },
                    "card3": {
                        "card": 4,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127790,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 2
                    },
                    "card2": {
                        "card": 8,
                        "type": 3
                    },
                    "card3": {
                        "card": 12,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 10,
                        "type": 1
                    },
                    "card3": {
                        "card": 3,
                        "type": 2
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127789,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 2
                    },
                    "card2": {
                        "card": 0,
                        "type": 1
                    },
                    "card3": {
                        "card": 12,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 0
                    },
                    "card2": {
                        "card": 0,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127788,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 3
                    },
                    "card2": {
                        "card": 7,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 5,
                        "type": 3
                    },
                    "card2": {
                        "card": 9,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127787,
            "result": {
                "player": {
                    "card1": {
                        "card": 7,
                        "type": 2
                    },
                    "card2": {
                        "card": 4,
                        "type": 2
                    },
                    "card3": {
                        "card": 10,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 3,
                        "type": 0
                    },
                    "card2": {
                        "card": 6,
                        "type": 2
                    },
                    "card3": {
                        "card": 6,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127786,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 3
                    },
                    "card2": {
                        "card": 6,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 0
                    },
                    "card2": {
                        "card": 3,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127785,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 2
                    },
                    "card2": {
                        "card": 10,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 12,
                        "type": 2
                    },
                    "card2": {
                        "card": 7,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127784,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 1
                    },
                    "card2": {
                        "card": 5,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 3
                    },
                    "card2": {
                        "card": 9,
                        "type": 0
                    },
                    "card3": {
                        "card": 2,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127783,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 2
                    },
                    "card2": {
                        "card": 3,
                        "type": 2
                    },
                    "card3": {
                        "card": 10,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127782,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 0
                    },
                    "card2": {
                        "card": 2,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 0
                    },
                    "card2": {
                        "card": 5,
                        "type": 3
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127781,
            "result": {
                "player": {
                    "card1": {
                        "card": 8,
                        "type": 1
                    },
                    "card2": {
                        "card": 7,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 10,
                        "type": 3
                    },
                    "card2": {
                        "card": 6,
                        "type": 3
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": false,
                "small": true,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127780,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 2
                    },
                    "card2": {
                        "card": 3,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 3
                    },
                    "card2": {
                        "card": 0,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": false,
                "small": true,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127779,
            "result": {
                "player": {
                    "card1": {
                        "card": 7,
                        "type": 2
                    },
                    "card2": {
                        "card": 5,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 3
                    },
                    "card2": {
                        "card": 8,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127778,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 2
                    },
                    "card2": {
                        "card": 8,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 0,
                        "type": 3
                    },
                    "card2": {
                        "card": 0,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": true,
                "natural": true
            }
        },
        {
            "roundId": 2127777,
            "result": {
                "player": {
                    "card1": {
                        "card": 7,
                        "type": 2
                    },
                    "card2": {
                        "card": 9,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 3
                    },
                    "card2": {
                        "card": 12,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": false,
                "small": true,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127776,
            "result": {
                "player": {
                    "card1": {
                        "card": 6,
                        "type": 3
                    },
                    "card2": {
                        "card": 2,
                        "type": 0
                    },
                    "card3": {
                        "card": 4,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 1
                    },
                    "card2": {
                        "card": 11,
                        "type": 1
                    },
                    "card3": {
                        "card": 7,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127775,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 2
                    },
                    "card2": {
                        "card": 4,
                        "type": 0
                    },
                    "card3": {
                        "card": 11,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 1
                    },
                    "card2": {
                        "card": 6,
                        "type": 0
                    },
                    "card3": {
                        "card": 1,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127774,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 0
                    },
                    "card2": {
                        "card": 4,
                        "type": 0
                    },
                    "card3": {
                        "card": 1,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 2
                    },
                    "card2": {
                        "card": 6,
                        "type": 2
                    },
                    "card3": {
                        "card": 7,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127773,
            "result": {
                "player": {
                    "card1": {
                        "card": 11,
                        "type": 1
                    },
                    "card2": {
                        "card": 3,
                        "type": 2
                    },
                    "card3": {
                        "card": 1,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 0
                    },
                    "card2": {
                        "card": 1,
                        "type": 2
                    },
                    "card3": {
                        "card": 11,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127772,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 1
                    },
                    "card2": {
                        "card": 10,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 1,
                        "type": 3
                    },
                    "card3": {
                        "card": 5,
                        "type": 2
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127771,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 3
                    },
                    "card2": {
                        "card": 11,
                        "type": 1
                    },
                    "card3": {
                        "card": 4,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 5,
                        "type": 3
                    },
                    "card2": {
                        "card": 6,
                        "type": 1
                    },
                    "card3": {
                        "card": 1,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": true,
                "small": false,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127770,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 2
                    },
                    "card2": {
                        "card": 11,
                        "type": 3
                    },
                    "card3": {
                        "card": 10,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 6,
                        "type": 1
                    },
                    "card2": {
                        "card": 9,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127769,
            "result": {
                "player": {
                    "card1": {
                        "card": 2,
                        "type": 3
                    },
                    "card2": {
                        "card": 7,
                        "type": 1
                    },
                    "card3": {
                        "card": 1,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 1
                    },
                    "card2": {
                        "card": 6,
                        "type": 0
                    },
                    "card3": {
                        "card": 8,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127768,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 1
                    },
                    "card2": {
                        "card": 7,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 1
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127767,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 1
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": {
                        "card": 0,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 0
                    },
                    "card2": {
                        "card": 7,
                        "type": 3
                    },
                    "card3": {
                        "card": 7,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127766,
            "result": {
                "player": {
                    "card1": {
                        "card": 8,
                        "type": 0
                    },
                    "card2": {
                        "card": 6,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 12,
                        "type": 3
                    },
                    "card2": {
                        "card": 12,
                        "type": 2
                    },
                    "card3": {
                        "card": 6,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": true,
                "natural": false
            }
        },
        {
            "roundId": 2127765,
            "result": {
                "player": {
                    "card1": {
                        "card": 6,
                        "type": 0
                    },
                    "card2": {
                        "card": 10,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 10,
                        "type": 0
                    },
                    "card2": {
                        "card": 0,
                        "type": 0
                    },
                    "card3": {
                        "card": 12,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127764,
            "result": {
                "player": {
                    "card1": {
                        "card": 4,
                        "type": 0
                    },
                    "card2": {
                        "card": 0,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 5,
                        "type": 1
                    },
                    "card2": {
                        "card": 5,
                        "type": 0
                    },
                    "card3": {
                        "card": 0,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": true,
                "natural": false
            }
        },
        {
            "roundId": 2127763,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 1
                    },
                    "card2": {
                        "card": 5,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 5,
                        "type": 1
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": {
                        "card": 10,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127762,
            "result": {
                "player": {
                    "card1": {
                        "card": 4,
                        "type": 1
                    },
                    "card2": {
                        "card": 12,
                        "type": 0
                    },
                    "card3": {
                        "card": 7,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 0
                    },
                    "card2": {
                        "card": 8,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127761,
            "result": {
                "player": {
                    "card1": {
                        "card": 12,
                        "type": 2
                    },
                    "card2": {
                        "card": 6,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 3
                    },
                    "card2": {
                        "card": 8,
                        "type": 3
                    },
                    "card3": {
                        "card": 0,
                        "type": 3
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127760,
            "result": {
                "player": {
                    "card1": {
                        "card": 6,
                        "type": 1
                    },
                    "card2": {
                        "card": 4,
                        "type": 2
                    },
                    "card3": {
                        "card": 7,
                        "type": 1
                    }
                },
                "banker": {
                    "card1": {
                        "card": 0,
                        "type": 3
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127759,
            "result": {
                "player": {
                    "card1": {
                        "card": 2,
                        "type": 3
                    },
                    "card2": {
                        "card": 9,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 8,
                        "type": 3
                    },
                    "card2": {
                        "card": 11,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127758,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 2
                    },
                    "card2": {
                        "card": 5,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 1,
                        "type": 0
                    },
                    "card2": {
                        "card": 7,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127757,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 2
                    },
                    "card2": {
                        "card": 2,
                        "type": 1
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 0
                    },
                    "card2": {
                        "card": 0,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127756,
            "result": {
                "player": {
                    "card1": {
                        "card": 10,
                        "type": 1
                    },
                    "card2": {
                        "card": 0,
                        "type": 3
                    },
                    "card3": {
                        "card": 3,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 7,
                        "type": 3
                    },
                    "card2": {
                        "card": 1,
                        "type": 1
                    },
                    "card3": {
                        "card": 7,
                        "type": 2
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127755,
            "result": {
                "player": {
                    "card1": {
                        "card": 7,
                        "type": 1
                    },
                    "card2": {
                        "card": 8,
                        "type": 0
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 11,
                        "type": 0
                    },
                    "card3": {
                        "card": 6,
                        "type": 2
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127754,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 3
                    },
                    "card2": {
                        "card": 12,
                        "type": 2
                    },
                    "card3": {
                        "card": 6,
                        "type": 3
                    }
                },
                "banker": {
                    "card1": {
                        "card": 8,
                        "type": 2
                    },
                    "card2": {
                        "card": 0,
                        "type": 1
                    },
                    "card3": {
                        "card": 7,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127753,
            "result": {
                "player": {
                    "card1": {
                        "card": 9,
                        "type": 0
                    },
                    "card2": {
                        "card": 2,
                        "type": 3
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 2,
                        "type": 0
                    },
                    "card2": {
                        "card": 4,
                        "type": 2
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127752,
            "result": {
                "player": {
                    "card1": {
                        "card": 11,
                        "type": 2
                    },
                    "card2": {
                        "card": 4,
                        "type": 1
                    },
                    "card3": {
                        "card": 10,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 11,
                        "type": 1
                    },
                    "card2": {
                        "card": 9,
                        "type": 2
                    },
                    "card3": {
                        "card": 0,
                        "type": 0
                    }
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127751,
            "result": {
                "player": {
                    "card1": {
                        "card": 5,
                        "type": 3
                    },
                    "card2": {
                        "card": 6,
                        "type": 3
                    },
                    "card3": {
                        "card": 9,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 9,
                        "type": 3
                    },
                    "card2": {
                        "card": 3,
                        "type": 0
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127750,
            "result": {
                "player": {
                    "card1": {
                        "card": 1,
                        "type": 3
                    },
                    "card2": {
                        "card": 7,
                        "type": 3
                    },
                    "card3": {
                        "card": 9,
                        "type": 0
                    }
                },
                "banker": {
                    "card1": {
                        "card": 12,
                        "type": 3
                    },
                    "card2": {
                        "card": 10,
                        "type": 3
                    },
                    "card3": {
                        "card": 7,
                        "type": 1
                    }
                }
            },
            "settlementResult": {
                "player": false,
                "banker": true,
                "big": true,
                "small": false,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127749,
            "result": {
                "player": {
                    "card1": {
                        "card": 3,
                        "type": 3
                    },
                    "card2": {
                        "card": 12,
                        "type": 3
                    },
                    "card3": {
                        "card": 2,
                        "type": 2
                    }
                },
                "banker": {
                    "card1": {
                        "card": 10,
                        "type": 1
                    },
                    "card2": {
                        "card": 6,
                        "type": 1
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": false,
                "banker": false,
                "big": true,
                "small": false,
                "tie": true,
                "playerPair": false,
                "bankerPair": false,
                "natural": false
            }
        },
        {
            "roundId": 2127748,
            "result": {
                "player": {
                    "card1": {
                        "card": 0,
                        "type": 2
                    },
                    "card2": {
                        "card": 7,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 6,
                        "type": 2
                    },
                    "card2": {
                        "card": 2,
                        "type": 3
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        },
        {
            "roundId": 2127747,
            "result": {
                "player": {
                    "card1": {
                        "card": 7,
                        "type": 0
                    },
                    "card2": {
                        "card": 12,
                        "type": 2
                    },
                    "card3": null
                },
                "banker": {
                    "card1": {
                        "card": 4,
                        "type": 0
                    },
                    "card2": {
                        "card": 6,
                        "type": 3
                    },
                    "card3": null
                }
            },
            "settlementResult": {
                "player": true,
                "banker": false,
                "big": false,
                "small": true,
                "tie": false,
                "playerPair": false,
                "bankerPair": false,
                "natural": true
            }
        }
    ]