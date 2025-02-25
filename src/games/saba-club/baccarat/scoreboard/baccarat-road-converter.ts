import { Converter } from "sc-scoreboards";
import { BaccaratSettlementResult } from "../type";

export class BaccaratRoadConverter extends Converter<BaccaratSettlementResult> {
    static addBlinkNode(rounds: BaccaratSettlementResult[]) {
        const lastRound = rounds.find((round) => round.winner === 'player' || round.winner === 'banker');

        const blinkRound: BaccaratSettlementResult = {
            winner: lastRound?.winner || 'player',
            playerPair: false,
            bankerPair: false,
            player: false,
            banker: false,
            tie: false,
            big: false,
            small: false
        };

        rounds.unshift(blinkRound);
    }

    static instance = new BaccaratRoadConverter();

    protected positiveKey(): string {
        return 'player';
    }

    protected specialKey(): string {
        return 'tie';
    }

    group(items: BaccaratSettlementResult[]): BaccaratSettlementResult[][] {
        const groups: BaccaratSettlementResult[][] = [];
        let currentGroup: BaccaratSettlementResult[] = [];

        for (const item of items) {
            if (currentGroup.length === 0 || currentGroup[0].winner === item.winner) {
                currentGroup.push(item);
            } else {
                groups.push(currentGroup);
                currentGroup = [item];
            }
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    }

    convert(group: BaccaratSettlementResult[]): boolean {
        if (group.length === 0) return false;
        const firstItem = group[0];
        return firstItem.winner === 'player';
    }
} 