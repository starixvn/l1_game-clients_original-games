import { IConverter } from "sc-scoreboards";
import { BaccaratSettlementResult } from "../type";

export class BaccaratRoadConverter implements IConverter<BaccaratSettlementResult> {
    private static _instance: BaccaratRoadConverter;

    private constructor() { }

    public static get instance(): BaccaratRoadConverter {
        if (!BaccaratRoadConverter._instance) {
            BaccaratRoadConverter._instance = new BaccaratRoadConverter();
        }
        return BaccaratRoadConverter._instance;
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