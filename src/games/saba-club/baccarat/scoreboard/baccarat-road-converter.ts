import { Converter } from "sc-scoreboards";
import { BaccaratSettlementResult } from "../type";

interface ConverterOptions {
    playerKey: string;
    tieKey: string;
}

class BaseRoadConverter<T, R> {
    constructor(protected readonly options: ConverterOptions) { }

    protected positiveKey(): string {
        return this.options.playerKey;
    }

    protected specialKey(): string {
        return this.options.tieKey;
    }

    convert(data: T): R {
        throw new Error('Not implemented');
    }
}

export class BaccaratRoadConverter extends BaseRoadConverter<BaccaratSettlementResult[], boolean> {
    private static defaultOptions: ConverterOptions = {
        playerKey: 'player',
        tieKey: 'tie'
    };

    static instance = new BaccaratRoadConverter(BaccaratRoadConverter.defaultOptions);

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

    constructor(options: ConverterOptions = BaccaratRoadConverter.defaultOptions) {
        super(options);
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
        return firstItem.winner === this.positiveKey();
    }
} 