import * as gc from "@sg/sg-game-client";
import { WinnerDisplay } from "../../../../_shared/components/winner-display/winner-display";
import { SettlementService } from "../services/settlement-service";
import Styles from "./fish-prawn-crab-animations.module.scss";

interface ResultDisplayProps {
    settlementResult: gc.GameServiceMessage.TSettlementResult;
    result: gc.GameServiceMessage.TResult;
    language?: string;
    className?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
    settlementResult,
    result,
    language,
    className
}) => {
    const t = (key) => gc.Translator.t(key, { lng: language || '' });

    if (!settlementResult || Object.keys(settlementResult).length === 0) {
        return null;
    }

    let resultText = '';

    if (settlementResult && Object.keys(settlementResult).length > 0) {
        const winningResult = SettlementService.getSettlementResult(settlementResult);
        const winningSymbols = SettlementService.getWinningSymbols(winningResult);

        const symbolNames = winningSymbols.map(symbol => {
            return t(`FishPrawnCrab.glossary_${symbol}`);
        });

        resultText = symbolNames.join(' - ');
    }

    if (!resultText && result && Object.keys(result).length > 0) {
        const { convertValueToSymbol } = require("../fish-prawn-crab-utils");
        const symbolNames = Object.values(result).map(value => {
            const symbol = convertValueToSymbol(value);
            return t(`FishPrawnCrab.glossary_${symbol}`);
        });
        resultText = symbolNames.join(' - ');
    }

    return <WinnerDisplay resultText={resultText} className={className || Styles['fish-prawn-crab-result']} />;
}; 