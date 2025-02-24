import type { Result } from "../baccarat";

export const BUTTON_LABELS = {
    NEXT_DEMO: 'Next Demo',
} as const;

export const TEXTS = {
    player: 'Player',
    banker: 'Banker',
} as const;

export const DEMO_RESULTS: ReadonlyArray<Result> = [
    {
        // Natural 9 vs 8 (both 2 cards)
        banker: { card1: { card: 4, type: 0 }, card2: { card: 5, type: 0 } },
        player: { card1: { card: 3, type: 1 }, card2: { card: 5, type: 1 } },
    },
    {
        // Banker 3 cards vs Player 2 cards
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 0 }, card3: { card: 4, type: 0 } },
        player: { card1: { card: 5, type: 1 }, card2: { card: 3, type: 1 } },
    },
    {
        // Player 3 cards vs Banker 2 cards
        banker: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 2 } },
        player: { card1: { card: 1, type: 3 }, card2: { card: 2, type: 3 }, card3: { card: 6, type: 3 } },
    },
    {
        // Both 3 cards - Player wins
        banker: { card1: { card: 2, type: 0 }, card2: { card: 1, type: 0 }, card3: { card: 3, type: 0 } },
        player: { card1: { card: 1, type: 1 }, card2: { card: 2, type: 1 }, card3: { card: 5, type: 1 } },
    },
    {
        // Both 3 cards - Banker wins
        banker: { card1: { card: 3, type: 2 }, card2: { card: 2, type: 2 }, card3: { card: 4, type: 2 } },
        player: { card1: { card: 2, type: 3 }, card2: { card: 3, type: 3 }, card3: { card: 3, type: 3 } },
    },
    {
        // Both 3 cards - Tie
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 0 }, card3: { card: 5, type: 0 } },
        player: { card1: { card: 2, type: 1 }, card2: { card: 3, type: 1 }, card3: { card: 3, type: 1 } },
    },
    {
        // Natural 8 vs need third card
        banker: { card1: { card: 4, type: 0 }, card2: { card: 4, type: 0 } },
        player: { card1: { card: 2, type: 1 }, card2: { card: 3, type: 1 }, card3: { card: 2, type: 1 } },
    },
    {
        // Banker pair with 3 cards
        banker: { card1: { card: 7, type: 0 }, card2: { card: 7, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 3, type: 2 }, card2: { card: 5, type: 2 } },
    },
    {
        // Player pair with 3 cards
        banker: { card1: { card: 2, type: 0 }, card2: { card: 5, type: 0 } },
        player: { card1: { card: 8, type: 1 }, card2: { card: 8, type: 2 }, card3: { card: 1, type: 3 } },
    },
    {
        // Both pairs and 3 cards
        banker: { card1: { card: 6, type: 0 }, card2: { card: 6, type: 1 }, card3: { card: 3, type: 2 } },
        player: { card1: { card: 4, type: 2 }, card2: { card: 4, type: 3 }, card3: { card: 2, type: 0 } },
    },
    {
        // Natural 9 (Player) vs 3 cards (Banker)
        banker: { card1: { card: 3, type: 0 }, card2: { card: 2, type: 0 }, card3: { card: 3, type: 0 } },
        player: { card1: { card: 4, type: 1 }, card2: { card: 5, type: 1 } },
    },
    {
        // Natural 9 (Banker) vs 3 cards (Player)
        banker: { card1: { card: 4, type: 2 }, card2: { card: 5, type: 2 } },
        player: { card1: { card: 2, type: 3 }, card2: { card: 3, type: 3 }, card3: { card: 3, type: 3 } },
    }
] as const; 