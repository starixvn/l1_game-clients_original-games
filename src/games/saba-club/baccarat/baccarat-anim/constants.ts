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

export const SCENARIOS = [
    // ... existing scenarios ...
] as const;

// Dragon tail demo data
export const DragonTailDemo: gc.RoundHistories.RoundHistory[] = [
    {
        roundId: 2128201,
        result: {
            player: {
                card1: { card: 8, type: 0 },
                card2: { card: 9, type: 1 }
            },
            banker: {
                card1: { card: 3, type: 2 },
                card2: { card: 4, type: 3 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: true,
            big: false,
            small: true
        }
    },
    {
        roundId: 2128202,
        result: {
            player: {
                card1: { card: 7, type: 1 },
                card2: { card: 8, type: 2 }
            },
            banker: {
                card1: { card: 2, type: 0 },
                card2: { card: 3, type: 1 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: true,
            big: false,
            small: true
        }
    },
    {
        roundId: 2128203,
        result: {
            player: {
                card1: { card: 6, type: 2 },
                card2: { card: 3, type: 3 },
                card3: { card: 8, type: 0 }
            },
            banker: {
                card1: { card: 4, type: 1 },
                card2: { card: 2, type: 2 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: false,
            big: true,
            small: false
        }
    },
    {
        roundId: 2128204,
        result: {
            player: {
                card1: { card: 5, type: 3 },
                card2: { card: 4, type: 0 },
                card3: { card: 9, type: 1 }
            },
            banker: {
                card1: { card: 3, type: 2 },
                card2: { card: 5, type: 3 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: false,
            big: true,
            small: false
        }
    },
    {
        roundId: 2128205,
        result: {
            player: {
                card1: { card: 7, type: 0 },
                card2: { card: 2, type: 1 },
                card3: { card: 8, type: 2 }
            },
            banker: {
                card1: { card: 4, type: 3 },
                card2: { card: 3, type: 0 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: false,
            big: true,
            small: false
        }
    },
    {
        roundId: 2128206,
        result: {
            player: {
                card1: { card: 6, type: 1 },
                card2: { card: 3, type: 2 },
                card3: { card: 9, type: 3 }
            },
            banker: {
                card1: { card: 2, type: 0 },
                card2: { card: 5, type: 1 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: false,
            big: true,
            small: false
        }
    },
    // Dragon tail starts here (3 more player wins)
    {
        roundId: 2128207,
        result: {
            player: {
                card1: { card: 8, type: 2 },
                card2: { card: 1, type: 3 },
                card3: { card: 8, type: 0 }
            },
            banker: {
                card1: { card: 3, type: 1 },
                card2: { card: 4, type: 2 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: false,
            big: true,
            small: false
        }
    },
    {
        roundId: 2128208,
        result: {
            player: {
                card1: { card: 7, type: 3 },
                card2: { card: 2, type: 0 },
                card3: { card: 9, type: 1 }
            },
            banker: {
                card1: { card: 4, type: 2 },
                card2: { card: 3, type: 3 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: false,
            big: true,
            small: false
        }
    },
    {
        roundId: 2128209,
        result: {
            player: {
                card1: { card: 6, type: 0 },
                card2: { card: 3, type: 1 },
                card3: { card: 8, type: 2 }
            },
            banker: {
                card1: { card: 2, type: 3 },
                card2: { card: 5, type: 0 }
            }
        },
        settlementResult: {
            player: true,
            banker: false,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: false,
            big: true,
            small: false
        }
    },
    // Switch to banker wins
    {
        roundId: 2128210,
        result: {
            player: {
                card1: { card: 2, type: 1 },
                card2: { card: 3, type: 2 }
            },
            banker: {
                card1: { card: 8, type: 3 },
                card2: { card: 1, type: 0 }
            }
        },
        settlementResult: {
            player: false,
            banker: true,
            tie: false,
            playerPair: false,
            bankerPair: false,
            natural: true,
            big: false,
            small: true
        }
    }
];

// Use DragonTailDemo for RoundHistory
export const RoundHistory: gc.RoundHistories.RoundHistory[] = DragonTailDemo;



