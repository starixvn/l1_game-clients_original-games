import * as gc from "@sg/sg-game-client";
import { WinnerDisplay } from "../../../../_shared/components/winner-display/winner-display";
import { SettlementService } from "../services/settlement-service";
import Styles from "./color-game-animations.module.scss";

interface ResultDisplayProps {
    settlementResult: gc.GameServiceMessage.TSettlementResult;
    language?: string;
    className?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
    settlementResult,
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
            return t(`ColorGame.glossary_${symbol}`);
        });

        resultText = symbolNames.join(' - ');
    }

    return <WinnerDisplay resultText={resultText} className={className || Styles['color-game-result']} />;
}; 