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

export const RoundHistory: gc.RoundHistories.RoundHistory[] = [
    {
        "roundId": 2128194,
        "result": {
            "player": {
                "card1": {
                    "card": 5,
                    "type": 3
                },
                "card2": {
                    "card": 11,
                    "type": 1
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 10,
                    "type": 1
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
        "roundId": 2128193,
        "result": {
            "player": {
                "card1": {
                    "card": 3,
                    "type": 1
                },
                "card2": {
                    "card": 5,
                    "type": 3
                },
                "card3": {
                    "card": 11,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 7,
                    "type": 1
                },
                "card2": {
                    "card": 4,
                    "type": 0
                },
                "card3": {
                    "card": 4,
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
        "roundId": 2128192,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 2
                },
                "card2": {
                    "card": 9,
                    "type": 1
                },
                "card3": {
                    "card": 3,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 8,
                    "type": 0
                },
                "card2": {
                    "card": 5,
                    "type": 3
                },
                "card3": {
                    "card": 9,
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
        "roundId": 2128191,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
                    "type": 1
                },
                "card2": {
                    "card": 0,
                    "type": 0
                },
                "card3": {
                    "card": 2,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 6,
                    "type": 1
                },
                "card2": {
                    "card": 10,
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
            "playerPair": true,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128190,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 1
                },
                "card2": {
                    "card": 2,
                    "type": 2
                },
                "card3": {
                    "card": 10,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 6,
                    "type": 3
                },
                "card2": {
                    "card": 7,
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
        "roundId": 2128189,
        "result": {
            "player": {
                "card1": {
                    "card": 6,
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
                    "card": 5,
                    "type": 0
                },
                "card2": {
                    "card": 6,
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
        "roundId": 2128188,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 3
                },
                "card2": {
                    "card": 6,
                    "type": 2
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 9,
                    "type": 1
                },
                "card2": {
                    "card": 2,
                    "type": 0
                },
                "card3": {
                    "card": 1,
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
        "roundId": 2128187,
        "result": {
            "player": {
                "card1": {
                    "card": 5,
                    "type": 2
                },
                "card2": {
                    "card": 1,
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
                    "card": 4,
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
            "natural": true
        }
    },
    {
        "roundId": 2128186,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 3
                },
                "card2": {
                    "card": 2,
                    "type": 0
                },
                "card3": {
                    "card": 10,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 2,
                    "type": 1
                },
                "card2": {
                    "card": 8,
                    "type": 0
                },
                "card3": {
                    "card": 1,
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
        "roundId": 2128185,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
                    "type": 0
                },
                "card2": {
                    "card": 12,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 8,
                    "type": 0
                },
                "card2": {
                    "card": 10,
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
        "roundId": 2128184,
        "result": {
            "player": {
                "card1": {
                    "card": 2,
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
                    "card": 4,
                    "type": 0
                },
                "card2": {
                    "card": 1,
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
        "roundId": 2128183,
        "result": {
            "player": {
                "card1": {
                    "card": 1,
                    "type": 0
                },
                "card2": {
                    "card": 12,
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
        "roundId": 2128182,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
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
                    "card": 6,
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
            "big": false,
            "small": true,
            "tie": false,
            "playerPair": false,
            "bankerPair": false,
            "natural": true
        }
    },
    {
        "roundId": 2128181,
        "result": {
            "player": {
                "card1": {
                    "card": 5,
                    "type": 1
                },
                "card2": {
                    "card": 9,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 0
                },
                "card2": {
                    "card": 4,
                    "type": 3
                },
                "card3": {
                    "card": 8,
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
        "roundId": 2128180,
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
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 4,
                    "type": 2
                },
                "card2": {
                    "card": 2,
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
        "roundId": 2128179,
        "result": {
            "player": {
                "card1": {
                    "card": 1,
                    "type": 1
                },
                "card2": {
                    "card": 8,
                    "type": 0
                },
                "card3": {
                    "card": 0,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 3,
                    "type": 2
                },
                "card2": {
                    "card": 10,
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
        "roundId": 2128178,
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
                    "card": 8,
                    "type": 3
                },
                "card2": {
                    "card": 9,
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
            "natural": true
        }
    },
    {
        "roundId": 2128177,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
                    "type": 1
                },
                "card2": {
                    "card": 10,
                    "type": 3
                },
                "card3": {
                    "card": 0,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 12,
                    "type": 2
                },
                "card2": {
                    "card": 2,
                    "type": 3
                },
                "card3": {
                    "card": 9,
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
        "roundId": 2128176,
        "result": {
            "player": {
                "card1": {
                    "card": 4,
                    "type": 3
                },
                "card2": {
                    "card": 8,
                    "type": 1
                },
                "card3": {
                    "card": 12,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 3,
                    "type": 1
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
        "roundId": 2128175,
        "result": {
            "player": {
                "card1": {
                    "card": 10,
                    "type": 1
                },
                "card2": {
                    "card": 4,
                    "type": 3
                },
                "card3": {
                    "card": 0,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 1,
                    "type": 3
                },
                "card2": {
                    "card": 10,
                    "type": 2
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
        "roundId": 2128174,
        "result": {
            "player": {
                "card1": {
                    "card": 6,
                    "type": 3
                },
                "card2": {
                    "card": 1,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 0,
                    "type": 2
                },
                "card2": {
                    "card": 12,
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
        "roundId": 2128173,
        "result": {
            "player": {
                "card1": {
                    "card": 3,
                    "type": 3
                },
                "card2": {
                    "card": 0,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 11,
                    "type": 0
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
            "big": false,
            "small": true,
            "tie": false,
            "playerPair": false,
            "bankerPair": false,
            "natural": true
        }
    },
    {
        "roundId": 2128172,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
                    "type": 1
                },
                "card2": {
                    "card": 11,
                    "type": 0
                },
                "card3": {
                    "card": 0,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 4,
                    "type": 0
                },
                "card2": {
                    "card": 7,
                    "type": 2
                },
                "card3": {
                    "card": 7,
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
        "roundId": 2128171,
        "result": {
            "player": {
                "card1": {
                    "card": 3,
                    "type": 2
                },
                "card2": {
                    "card": 4,
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
        "roundId": 2128170,
        "result": {
            "player": {
                "card1": {
                    "card": 1,
                    "type": 2
                },
                "card2": {
                    "card": 2,
                    "type": 2
                },
                "card3": {
                    "card": 10,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 12,
                    "type": 1
                },
                "card2": {
                    "card": 9,
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
        "roundId": 2128169,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 2
                },
                "card2": {
                    "card": 10,
                    "type": 2
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 7,
                    "type": 2
                },
                "card2": {
                    "card": 0,
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
        "roundId": 2128168,
        "result": {
            "player": {
                "card1": {
                    "card": 7,
                    "type": 3
                },
                "card2": {
                    "card": 6,
                    "type": 0
                },
                "card3": {
                    "card": 11,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 3
                },
                "card2": {
                    "card": 3,
                    "type": 1
                },
                "card3": {
                    "card": 11,
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
        "roundId": 2128167,
        "result": {
            "player": {
                "card1": {
                    "card": 9,
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
                    "card": 5,
                    "type": 2
                },
                "card2": {
                    "card": 0,
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
        "roundId": 2128166,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 2
                },
                "card2": {
                    "card": 10,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 2,
                    "type": 2
                },
                "card2": {
                    "card": 7,
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
        "roundId": 2128165,
        "result": {
            "player": {
                "card1": {
                    "card": 1,
                    "type": 2
                },
                "card2": {
                    "card": 3,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 8,
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
            "natural": false
        }
    },
    {
        "roundId": 2128164,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 0
                },
                "card2": {
                    "card": 3,
                    "type": 2
                },
                "card3": {
                    "card": 7,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 11,
                    "type": 3
                },
                "card2": {
                    "card": 9,
                    "type": 3
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
        "roundId": 2128163,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 3
                },
                "card2": {
                    "card": 7,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 8,
                    "type": 1
                },
                "card2": {
                    "card": 10,
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
        "roundId": 2128162,
        "result": {
            "player": {
                "card1": {
                    "card": 9,
                    "type": 0
                },
                "card2": {
                    "card": 0,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 10,
                    "type": 2
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
        "roundId": 2128161,
        "result": {
            "player": {
                "card1": {
                    "card": 2,
                    "type": 3
                },
                "card2": {
                    "card": 10,
                    "type": 1
                },
                "card3": {
                    "card": 5,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 6,
                    "type": 2
                },
                "card2": {
                    "card": 2,
                    "type": 1
                },
                "card3": {
                    "card": 11,
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
        "roundId": 2128160,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 3
                },
                "card2": {
                    "card": 3,
                    "type": 1
                },
                "card3": {
                    "card": 10,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 9,
                    "type": 2
                },
                "card2": {
                    "card": 6,
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
        "roundId": 2128159,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
                    "type": 3
                },
                "card2": {
                    "card": 7,
                    "type": 2
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 8,
                    "type": 2
                },
                "card2": {
                    "card": 4,
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
        "roundId": 2128158,
        "result": {
            "player": {
                "card1": {
                    "card": 2,
                    "type": 0
                },
                "card2": {
                    "card": 10,
                    "type": 0
                },
                "card3": {
                    "card": 1,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 6,
                    "type": 0
                },
                "card2": {
                    "card": 5,
                    "type": 3
                },
                "card3": {
                    "card": 8,
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
        "roundId": 2128157,
        "result": {
            "player": {
                "card1": {
                    "card": 9,
                    "type": 0
                },
                "card2": {
                    "card": 10,
                    "type": 2
                },
                "card3": {
                    "card": 8,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 0
                },
                "card2": {
                    "card": 3,
                    "type": 2
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
        "roundId": 2128156,
        "result": {
            "player": {
                "card1": {
                    "card": 7,
                    "type": 1
                },
                "card2": {
                    "card": 8,
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
                    "card": 10,
                    "type": 0
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
            "playerPair": false,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128155,
        "result": {
            "player": {
                "card1": {
                    "card": 9,
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
                    "card": 3,
                    "type": 2
                },
                "card2": {
                    "card": 4,
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
            "natural": true
        }
    },
    {
        "roundId": 2128154,
        "result": {
            "player": {
                "card1": {
                    "card": 4,
                    "type": 2
                },
                "card2": {
                    "card": 4,
                    "type": 0
                },
                "card3": {
                    "card": 3,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 2,
                    "type": 2
                },
                "card2": {
                    "card": 0,
                    "type": 3
                },
                "card3": {
                    "card": 9,
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
            "playerPair": true,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128153,
        "result": {
            "player": {
                "card1": {
                    "card": 2,
                    "type": 0
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
                    "card": 2,
                    "type": 3
                },
                "card3": {
                    "card": 4,
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
            "playerPair": true,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128152,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 1
                },
                "card2": {
                    "card": 11,
                    "type": 2
                },
                "card3": {
                    "card": 3,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 2
                },
                "card2": {
                    "card": 10,
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
            "playerPair": true,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128151,
        "result": {
            "player": {
                "card1": {
                    "card": 6,
                    "type": 0
                },
                "card2": {
                    "card": 9,
                    "type": 2
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 1,
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
            "natural": false
        }
    },
    {
        "roundId": 2128150,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
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
                    "card": 11,
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
        "roundId": 2128149,
        "result": {
            "player": {
                "card1": {
                    "card": 10,
                    "type": 1
                },
                "card2": {
                    "card": 0,
                    "type": 0
                },
                "card3": {
                    "card": 6,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 2,
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
            "big": true,
            "small": false,
            "tie": false,
            "playerPair": false,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128148,
        "result": {
            "player": {
                "card1": {
                    "card": 5,
                    "type": 1
                },
                "card2": {
                    "card": 0,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 2,
                    "type": 3
                },
                "card2": {
                    "card": 12,
                    "type": 2
                },
                "card3": {
                    "card": 11,
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
        "roundId": 2128147,
        "result": {
            "player": {
                "card1": {
                    "card": 4,
                    "type": 2
                },
                "card2": {
                    "card": 9,
                    "type": 0
                },
                "card3": {
                    "card": 0,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 3,
                    "type": 3
                },
                "card2": {
                    "card": 9,
                    "type": 1
                },
                "card3": null
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
        "roundId": 2128146,
        "result": {
            "player": {
                "card1": {
                    "card": 7,
                    "type": 3
                },
                "card2": {
                    "card": 8,
                    "type": 2
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 3
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
            "big": false,
            "small": true,
            "tie": false,
            "playerPair": false,
            "bankerPair": false,
            "natural": true
        }
    },
    {
        "roundId": 2128145,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 2
                },
                "card2": {
                    "card": 8,
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
                    "card": 10,
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
        "roundId": 2128144,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
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
                    "card": 1,
                    "type": 1
                },
                "card2": {
                    "card": 6,
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
        "roundId": 2128143,
        "result": {
            "player": {
                "card1": {
                    "card": 6,
                    "type": 2
                },
                "card2": {
                    "card": 9,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 3,
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
            "bankerPair": true,
            "natural": true
        }
    },
    {
        "roundId": 2128142,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 2
                },
                "card2": {
                    "card": 4,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 7,
                    "type": 3
                },
                "card2": {
                    "card": 11,
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
        "roundId": 2128141,
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
                    "card": 0,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 2,
                    "type": 1
                },
                "card2": {
                    "card": 1,
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
        "roundId": 2128140,
        "result": {
            "player": {
                "card1": {
                    "card": 9,
                    "type": 2
                },
                "card2": {
                    "card": 3,
                    "type": 3
                },
                "card3": {
                    "card": 1,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 9,
                    "type": 3
                },
                "card2": {
                    "card": 12,
                    "type": 0
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
            "playerPair": false,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128139,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
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
                    "card": 6,
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
        "roundId": 2128138,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 2
                },
                "card2": {
                    "card": 3,
                    "type": 1
                },
                "card3": {
                    "card": 1,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 12,
                    "type": 2
                },
                "card2": {
                    "card": 1,
                    "type": 2
                },
                "card3": {
                    "card": 11,
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
        "roundId": 2128137,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 1
                },
                "card2": {
                    "card": 10,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 0,
                    "type": 2
                },
                "card2": {
                    "card": 2,
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
        "roundId": 2128136,
        "result": {
            "player": {
                "card1": {
                    "card": 6,
                    "type": 0
                },
                "card2": {
                    "card": 12,
                    "type": 1
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 0,
                    "type": 1
                },
                "card2": {
                    "card": 8,
                    "type": 0
                },
                "card3": {
                    "card": 3,
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
        "roundId": 2128135,
        "result": {
            "player": {
                "card1": {
                    "card": 3,
                    "type": 2
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
            "big": false,
            "small": true,
            "tie": false,
            "playerPair": false,
            "bankerPair": false,
            "natural": true
        }
    },
    {
        "roundId": 2128134,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 0
                },
                "card2": {
                    "card": 8,
                    "type": 1
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 9,
                    "type": 3
                },
                "card2": {
                    "card": 4,
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
        "roundId": 2128133,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 0
                },
                "card2": {
                    "card": 9,
                    "type": 3
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
        "roundId": 2128132,
        "result": {
            "player": {
                "card1": {
                    "card": 4,
                    "type": 1
                },
                "card2": {
                    "card": 2,
                    "type": 1
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
        "roundId": 2128131,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 1
                },
                "card2": {
                    "card": 9,
                    "type": 2
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 1,
                    "type": 3
                },
                "card2": {
                    "card": 12,
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
        "roundId": 2128130,
        "result": {
            "player": {
                "card1": {
                    "card": 9,
                    "type": 0
                },
                "card2": {
                    "card": 1,
                    "type": 1
                },
                "card3": {
                    "card": 6,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 7,
                    "type": 0
                },
                "card2": {
                    "card": 6,
                    "type": 1
                },
                "card3": {
                    "card": 0,
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
        "roundId": 2128129,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 1
                },
                "card2": {
                    "card": 6,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 6,
                    "type": 2
                },
                "card2": {
                    "card": 10,
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
            "natural": false
        }
    },
    {
        "roundId": 2128128,
        "result": {
            "player": {
                "card1": {
                    "card": 9,
                    "type": 2
                },
                "card2": {
                    "card": 7,
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
                    "card": 1,
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
        "roundId": 2128127,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 3
                },
                "card2": {
                    "card": 11,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 3
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
            "big": false,
            "small": true,
            "tie": false,
            "playerPair": true,
            "bankerPair": false,
            "natural": true
        }
    },
    {
        "roundId": 2128126,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 1
                },
                "card2": {
                    "card": 11,
                    "type": 1
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 3,
                    "type": 0
                },
                "card2": {
                    "card": 2,
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
        "roundId": 2128125,
        "result": {
            "player": {
                "card1": {
                    "card": 10,
                    "type": 1
                },
                "card2": {
                    "card": 2,
                    "type": 2
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 8,
                    "type": 0
                },
                "card2": {
                    "card": 9,
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
        "roundId": 2128124,
        "result": {
            "player": {
                "card1": {
                    "card": 1,
                    "type": 3
                },
                "card2": {
                    "card": 1,
                    "type": 0
                },
                "card3": {
                    "card": 9,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 0
                },
                "card2": {
                    "card": 6,
                    "type": 0
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
            "playerPair": true,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128123,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 0
                },
                "card2": {
                    "card": 4,
                    "type": 0
                },
                "card3": {
                    "card": 12,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 0,
                    "type": 3
                },
                "card2": {
                    "card": 12,
                    "type": 2
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
        "roundId": 2128122,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 0
                },
                "card2": {
                    "card": 6,
                    "type": 1
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 8,
                    "type": 0
                },
                "card2": {
                    "card": 3,
                    "type": 2
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
        "roundId": 2128121,
        "result": {
            "player": {
                "card1": {
                    "card": 6,
                    "type": 0
                },
                "card2": {
                    "card": 5,
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
                    "type": 3
                },
                "card2": {
                    "card": 2,
                    "type": 0
                },
                "card3": {
                    "card": 2,
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
        "roundId": 2128120,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 0
                },
                "card2": {
                    "card": 4,
                    "type": 1
                },
                "card3": {
                    "card": 9,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 3,
                    "type": 2
                },
                "card2": {
                    "card": 8,
                    "type": 3
                },
                "card3": {
                    "card": 3,
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
        "roundId": 2128119,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 0
                },
                "card2": {
                    "card": 1,
                    "type": 1
                },
                "card3": {
                    "card": 2,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 4,
                    "type": 0
                },
                "card2": {
                    "card": 8,
                    "type": 0
                },
                "card3": {
                    "card": 5,
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
        "roundId": 2128118,
        "result": {
            "player": {
                "card1": {
                    "card": 3,
                    "type": 0
                },
                "card2": {
                    "card": 8,
                    "type": 0
                },
                "card3": {
                    "card": 2,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 9,
                    "type": 0
                },
                "card2": {
                    "card": 6,
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
        "roundId": 2128117,
        "result": {
            "player": {
                "card1": {
                    "card": 2,
                    "type": 1
                },
                "card2": {
                    "card": 4,
                    "type": 1
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 6,
                    "type": 0
                },
                "card2": {
                    "card": 11,
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
        "roundId": 2128116,
        "result": {
            "player": {
                "card1": {
                    "card": 9,
                    "type": 2
                },
                "card2": {
                    "card": 2,
                    "type": 3
                },
                "card3": {
                    "card": 5,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 6,
                    "type": 1
                },
                "card2": {
                    "card": 3,
                    "type": 2
                },
                "card3": {
                    "card": 8,
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
        "roundId": 2128115,
        "result": {
            "player": {
                "card1": {
                    "card": 3,
                    "type": 1
                },
                "card2": {
                    "card": 0,
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
                    "type": 2
                },
                "card2": {
                    "card": 7,
                    "type": 2
                },
                "card3": {
                    "card": 7,
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
        "roundId": 2128114,
        "result": {
            "player": {
                "card1": {
                    "card": 10,
                    "type": 2
                },
                "card2": {
                    "card": 12,
                    "type": 1
                },
                "card3": {
                    "card": 11,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 2,
                    "type": 2
                },
                "card2": {
                    "card": 11,
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
        "roundId": 2128113,
        "result": {
            "player": {
                "card1": {
                    "card": 4,
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
                    "card": 2,
                    "type": 2
                },
                "card2": {
                    "card": 3,
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
        "roundId": 2128112,
        "result": {
            "player": {
                "card1": {
                    "card": 6,
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
        "roundId": 2128111,
        "result": {
            "player": {
                "card1": {
                    "card": 4,
                    "type": 2
                },
                "card2": {
                    "card": 7,
                    "type": 1
                },
                "card3": {
                    "card": 2,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 9,
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
        "roundId": 2128110,
        "result": {
            "player": {
                "card1": {
                    "card": 5,
                    "type": 2
                },
                "card2": {
                    "card": 8,
                    "type": 2
                },
                "card3": {
                    "card": 7,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 6,
                    "type": 1
                },
                "card2": {
                    "card": 11,
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
        "roundId": 2128109,
        "result": {
            "player": {
                "card1": {
                    "card": 12,
                    "type": 2
                },
                "card2": {
                    "card": 2,
                    "type": 1
                },
                "card3": {
                    "card": 10,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 7,
                    "type": 0
                },
                "card2": {
                    "card": 3,
                    "type": 2
                },
                "card3": {
                    "card": 6,
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
        "roundId": 2128108,
        "result": {
            "player": {
                "card1": {
                    "card": 4,
                    "type": 0
                },
                "card2": {
                    "card": 8,
                    "type": 2
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
                    "card": 7,
                    "type": 1
                },
                "card3": {
                    "card": 4,
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
        "roundId": 2128107,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
                    "type": 0
                },
                "card2": {
                    "card": 7,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 0
                },
                "card2": {
                    "card": 3,
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
        "roundId": 2128106,
        "result": {
            "player": {
                "card1": {
                    "card": 2,
                    "type": 1
                },
                "card2": {
                    "card": 11,
                    "type": 2
                },
                "card3": {
                    "card": 9,
                    "type": 1
                }
            },
            "banker": {
                "card1": {
                    "card": 0,
                    "type": 1
                },
                "card2": {
                    "card": 10,
                    "type": 2
                },
                "card3": {
                    "card": 2,
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
        "roundId": 2128105,
        "result": {
            "player": {
                "card1": {
                    "card": 5,
                    "type": 1
                },
                "card2": {
                    "card": 2,
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
                    "card": 10,
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
        "roundId": 2128104,
        "result": {
            "player": {
                "card1": {
                    "card": 3,
                    "type": 3
                },
                "card2": {
                    "card": 9,
                    "type": 3
                },
                "card3": {
                    "card": 10,
                    "type": 3
                }
            },
            "banker": {
                "card1": {
                    "card": 0,
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
            "big": true,
            "small": false,
            "tie": false,
            "playerPair": false,
            "bankerPair": false,
            "natural": false
        }
    },
    {
        "roundId": 2128103,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 0
                },
                "card2": {
                    "card": 12,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 3,
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
        "roundId": 2128102,
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
                    "card": 4,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 11,
                    "type": 2
                },
                "card2": {
                    "card": 6,
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
        "roundId": 2128101,
        "result": {
            "player": {
                "card1": {
                    "card": 0,
                    "type": 0
                },
                "card2": {
                    "card": 4,
                    "type": 0
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 8,
                    "type": 0
                },
                "card2": {
                    "card": 5,
                    "type": 1
                },
                "card3": {
                    "card": 2,
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
        "roundId": 2128100,
        "result": {
            "player": {
                "card1": {
                    "card": 1,
                    "type": 1
                },
                "card2": {
                    "card": 3,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 2
                },
                "card2": {
                    "card": 5,
                    "type": 1
                },
                "card3": {
                    "card": 12,
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
            "bankerPair": true,
            "natural": false
        }
    },
    {
        "roundId": 2128099,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 0
                },
                "card2": {
                    "card": 2,
                    "type": 1
                },
                "card3": {
                    "card": 0,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 1,
                    "type": 1
                },
                "card2": {
                    "card": 11,
                    "type": 0
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
        "roundId": 2128098,
        "result": {
            "player": {
                "card1": {
                    "card": 3,
                    "type": 3
                },
                "card2": {
                    "card": 4,
                    "type": 2
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 5,
                    "type": 3
                },
                "card2": {
                    "card": 1,
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
        "roundId": 2128097,
        "result": {
            "player": {
                "card1": {
                    "card": 10,
                    "type": 0
                },
                "card2": {
                    "card": 3,
                    "type": 0
                },
                "card3": {
                    "card": 0,
                    "type": 0
                }
            },
            "banker": {
                "card1": {
                    "card": 10,
                    "type": 3
                },
                "card2": {
                    "card": 0,
                    "type": 2
                },
                "card3": {
                    "card": 9,
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
        "roundId": 2128096,
        "result": {
            "player": {
                "card1": {
                    "card": 7,
                    "type": 3
                },
                "card2": {
                    "card": 4,
                    "type": 3
                },
                "card3": {
                    "card": 6,
                    "type": 2
                }
            },
            "banker": {
                "card1": {
                    "card": 0,
                    "type": 0
                },
                "card2": {
                    "card": 9,
                    "type": 0
                },
                "card3": {
                    "card": 10,
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
        "roundId": 2128095,
        "result": {
            "player": {
                "card1": {
                    "card": 8,
                    "type": 2
                },
                "card2": {
                    "card": 11,
                    "type": 1
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
        "roundId": 2128094,
        "result": {
            "player": {
                "card1": {
                    "card": 11,
                    "type": 0
                },
                "card2": {
                    "card": 8,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 11,
                    "type": 2
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
        "roundId": 2128093,
        "result": {
            "player": {
                "card1": {
                    "card": 7,
                    "type": 3
                },
                "card2": {
                    "card": 11,
                    "type": 3
                },
                "card3": null
            },
            "banker": {
                "card1": {
                    "card": 9,
                    "type": 3
                },
                "card2": {
                    "card": 12,
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
    }
];




// [
//     {
//         "roundId": 2127889,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 5,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 12,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 5,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127888,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127887,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127886,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 6,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 12,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127885,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": true,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127884,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 7,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127883,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127882,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 9,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127881,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127880,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 5,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127879,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 4,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 5,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127878,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 5,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127877,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 10,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 5,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127876,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127875,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127874,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 7,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 5,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127873,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127872,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127871,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 6,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127870,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127869,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 10,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127868,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127867,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127866,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 5,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127865,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 2,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127864,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 4,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 7,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": true,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127863,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127862,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 10,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 5,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127861,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127860,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127859,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 2,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 0,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127858,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 7,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": true,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127857,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 12,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127856,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 10,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127855,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127854,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 7,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127853,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127852,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 7,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 4,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127851,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 6,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127850,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 12,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": true,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127849,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 8,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127848,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 5,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": true,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127847,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127846,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 7,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127845,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 5,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127844,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 11,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 7,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": true,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127843,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 5,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127842,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 4,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 8,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127841,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": true,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127840,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 11,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127839,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127838,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127837,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127836,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 2,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 7,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 7,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": true,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127835,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 8,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 10,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127834,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 4,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 8,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127833,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 12,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 2,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127832,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 5,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127831,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127830,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 0,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127829,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 5,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 2,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127828,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 10,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127827,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 12,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127826,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 5,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127825,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 6,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127824,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 1,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127823,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 2,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127822,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127821,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 5,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 2,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127820,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 7,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 10,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127819,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 2
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127818,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 4,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 2,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127817,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 4,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127816,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 10,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 2,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127815,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127814,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 10,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 4,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127813,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 11,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127812,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127811,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 6,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127810,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127809,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 7,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127808,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127807,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127806,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 7,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": true,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127805,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 2,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 4,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127804,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 2,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 11,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127803,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 3
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127802,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 7,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 5,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127801,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 6,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 0
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 10,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127800,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 6,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 5,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 4,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127799,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 2,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 9,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 3,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127798,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 0,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 6,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127797,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 9,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 7,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": true,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127796,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 5,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 2
//                 },
//                 "card3": {
//                     "card": 2,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127795,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 12,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 8,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127794,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 1,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 4,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 2,
//                     "type": 3
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     },
//     {
//         "roundId": 2127793,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 5,
//                     "type": 1
//                 },
//                 "card2": {
//                     "card": 12,
//                     "type": 2
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 4,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 6,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": true,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127792,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 4,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 4,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 1,
//                     "type": 3
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 4,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 0,
//                     "type": 0
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": true,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127791,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 3,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 1,
//                     "type": 1
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 11,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 0
//                 },
//                 "card3": {
//                     "card": 4,
//                     "type": 1
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127790,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 1,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 8,
//                     "type": 3
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 0
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 2,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 10,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 3,
//                     "type": 2
//                 }
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127789,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 9,
//                     "type": 2
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 1
//                 },
//                 "card3": {
//                     "card": 12,
//                     "type": 1
//                 }
//             },
//             "banker": {
//                 "card1": {
//                     "card": 4,
//                     "type": 0
//                 },
//                 "card2": {
//                     "card": 0,
//                     "type": 0
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": false,
//             "banker": true,
//             "big": true,
//             "small": false,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": false
//         }
//     },
//     {
//         "roundId": 2127788,
//         "result": {
//             "player": {
//                 "card1": {
//                     "card": 9,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 7,
//                     "type": 3
//                 },
//                 "card3": null
//             },
//             "banker": {
//                 "card1": {
//                     "card": 5,
//                     "type": 3
//                 },
//                 "card2": {
//                     "card": 9,
//                     "type": 2
//                 },
//                 "card3": null
//             }
//         },
//         "settlementResult": {
//             "player": true,
//             "banker": false,
//             "big": false,
//             "small": true,
//             "tie": false,
//             "playerPair": false,
//             "bankerPair": false,
//             "natural": true
//         }
//     }
// ]