import type { Result } from "../baccarat";

export const TEXTS = {
    player: 'Player',
    banker: 'Banker',
} as const;

export const DEMO_RESULTS: ReadonlyArray<Result> = [
    {
        // Natural 9 vs 8 (both 2 cards)
        // Player: 3♣(2,2) + 5♦(4,3) = 8 (Natural)
        // Banker: 4♠(3,0) + 5♥(4,1) = 9 (Natural)
        // Result: Banker wins with Natural 9
        banker: { card1: { card: 3, type: 0 }, card2: { card: 4, type: 1 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 4, type: 3 } },
    },
    {
        // Natural 8 vs Natural 9
        // Player: 5♣(4,2) + 4♦(3,3) = 9 (Natural)
        // Banker: 4♠(3,0) + 4♥(3,1) = 8 (Natural)
        // Result: Player wins with Natural 9
        banker: { card1: { card: 3, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 4, type: 2 }, card2: { card: 3, type: 3 } },
    },
    {
        // Natural tie (both Natural 8)
        // Player: 3♣(2,2) + 5♦(4,3) = 8 (Natural)
        // Banker: 4♠(3,0) + 4♥(3,1) = 8 (Natural)
        // Result: Tie with both Natural 8s
        banker: { card1: { card: 3, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 4, type: 3 } },
    },
    {
        // Perfect Pair - Banker (same rank, same suit)
        // Player: 3♣(2,2) + 4♦(3,3) = 7
        // Banker: 4♠(3,0) + 4♠(3,0) = 8 (Perfect Pair)
        // Result: Banker wins with Perfect Pair and higher total
        banker: { card1: { card: 3, type: 0 }, card2: { card: 3, type: 0 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 3 } },
    },
    {
        // Perfect Pair - Player (same rank, same suit)
        // Player: 4♣(3,2) + 4♣(3,2) = 8 (Perfect Pair)
        // Banker: 3♠(2,0) + 4♥(3,1) = 7
        // Result: Player wins with Perfect Pair and higher total
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 3, type: 2 }, card2: { card: 3, type: 2 } },
    },
    {
        // Both Perfect Pairs
        // Player: 3♣(2,2) + 3♣(2,2) = 6 (Perfect Pair)
        // Banker: 4♠(3,0) + 4♠(3,0) = 8 (Perfect Pair)
        // Result: Both have Perfect Pairs, Banker wins with higher total
        banker: { card1: { card: 3, type: 0 }, card2: { card: 3, type: 0 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 2, type: 2 } },
    },
    {
        // Super 6 (Banker wins with 6)
        // Player: 2♣(1,2) + 3♦(2,3) = 5
        // Banker: 3♠(2,0) + 3♥(2,1) = 6 (Super 6)
        // Result: Banker wins with Super 6 (pays special odds)
        banker: { card1: { card: 2, type: 0 }, card2: { card: 2, type: 1 } },
        player: { card1: { card: 1, type: 2 }, card2: { card: 2, type: 3 } },
    },
    {
        // Dragon Bonus - Natural win
        // Player: 3♣(2,2) + 4♦(3,3) = 7
        // Banker: 4♠(3,0) + 5♥(4,1) = 9 (Natural)
        // Result: Banker Natural win by 2 points (Dragon Bonus)
        banker: { card1: { card: 3, type: 0 }, card2: { card: 4, type: 1 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 3 } },
    },
    {
        // Dragon Bonus - Non-natural win by 9 points
        // Player: 9♦(8,3) + J♠(10,0) = 9
        // Banker: 4♠(3,0) + 5♥(4,1) + A♣(0,2) = 0
        // Result: Player wins by 9 points (Dragon Bonus)
        banker: { card1: { card: 3, type: 0 }, card2: { card: 4, type: 1 }, card3: { card: 0, type: 2 } },
        player: { card1: { card: 8, type: 3 }, card2: { card: 10, type: 0 } },
    },
    {
        // Banker 3 cards vs Player 2 cards
        // Player: 3♦(2,3) + 4♠(3,0) = 7
        // Banker: 2♠(1,0) + 3♥(2,1) + 3♣(2,2) = 8
        // Result: Banker wins with three cards
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 2, type: 3 }, card2: { card: 3, type: 0 } },
    },
    {
        // Player 3 cards vs Banker 2 cards
        // Player: 2♣(1,2) + 3♦(2,3) + 5♠(4,0) = 0
        // Banker: 3♠(2,0) + 4♥(3,1) = 7
        // Result: Banker wins against Player's three cards
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 1, type: 2 }, card2: { card: 2, type: 3 }, card3: { card: 4, type: 0 } },
    },
    {
        // Both 3 cards - Player wins
        // Player: 3♣(2,2) + 4♦(3,3) + 4♠(3,0) = 1
        // Banker: 2♠(1,0) + 3♥(2,1) + 3♣(2,2) = 8
        // Result: Player wins with three cards each
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 3 }, card3: { card: 3, type: 0 } },
    },
    {
        // Both 3 cards - Banker wins
        // Player: 2♣(1,2) + 3♦(2,3) + 2♥(1,1) = 7
        // Banker: 3♠(2,0) + 4♥(3,1) + 3♣(2,2) = 0
        // Result: Banker wins with three cards each
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 1, type: 2 }, card2: { card: 2, type: 3 }, card3: { card: 1, type: 1 } },
    },
    {
        // Both 3 cards - Tie
        // Player: 3♣(2,2) + 4♦(3,3) + 2♠(1,0) = 8
        // Banker: 2♠(1,0) + 3♥(2,1) + 3♣(2,2) = 8
        // Result: Tie with three cards each
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 3 }, card3: { card: 1, type: 0 } },
    },
    {
        // Three-card hand with multiple pairs
        // Player: 4♦(3,3) + 4♠(3,0) + 2♥(1,1) = 0 (One pair)
        // Banker: 3♠(2,0) + 3♥(2,1) + 3♣(2,2) = 9 (Three of a kind)
        // Result: Banker wins with three of a kind
        banker: { card1: { card: 2, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 3, type: 3 }, card2: { card: 3, type: 0 }, card3: { card: 1, type: 1 } },
    },
    {
        // Dragon 7 (Banker wins with 3 cards totaling 7)
        // Player: 3♦(2,3) + 4♠(3,0) = 6
        // Banker: 2♠(1,0) + 3♥(2,1) + 3♣(2,2) = 7 (Dragon 7)
        // Result: Banker wins with Dragon 7 (pays special odds)
        banker: { card1: { card: 1, type: 0 }, card2: { card: 2, type: 1 }, card3: { card: 2, type: 2 } },
        player: { card1: { card: 2, type: 3 }, card2: { card: 3, type: 0 } },
    },
    {
        // Panda 8 (Player wins with 3 cards totaling 8)
        // Player: 2♣(1,2) + 3♦(2,3) + 4♠(3,0) = 8 (Panda 8)
        // Banker: 3♠(2,0) + 4♥(3,1) = 7
        // Result: Player wins with Panda 8 (pays special odds)
        banker: { card1: { card: 2, type: 0 }, card2: { card: 3, type: 1 } },
        player: { card1: { card: 1, type: 2 }, card2: { card: 2, type: 3 }, card3: { card: 3, type: 0 } },
    },
    {
        // Natural tie 9
        // Player: 5♣(4,2) + 4♦(3,3) = 9 (Natural)
        // Banker: 4♠(3,0) + 5♥(4,1) = 9 (Natural)
        // Result: Natural tie at 9 (highest possible tie)
        banker: { card1: { card: 3, type: 0 }, card2: { card: 4, type: 1 } },
        player: { card1: { card: 4, type: 2 }, card2: { card: 3, type: 3 } },
    }
] as const; 