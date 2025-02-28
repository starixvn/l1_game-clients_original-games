import { Converter } from "sc-scoreboards";
import { choices, BigSmallSettlementResult } from "../../../types/settlement-result";

export class BigSmallBigRoadConverter extends Converter<BigSmallSettlementResult> {
    static addBlinkNode(rounds: BigSmallSettlementResult[]) {
        const lastRound = rounds.find((round) => round.big || round.small);

        const blinkRound = {
            big: lastRound?.big,
            small: undefined,
        };

        rounds.unshift(blinkRound);
    }

    static instance = new BigSmallBigRoadConverter();

    protected positiveKey(): string {
        return choices.odd;
    }

    protected specialKey(): string {
        return "";
    }
}
