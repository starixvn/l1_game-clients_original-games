import React from 'react';
import * as gc from '@sg/sg-game-client';
import FishPrawnCrabDot from '../../dot/fish-prawn-crab-dot';
import { ISettlementResultService } from '../../services/settlement-result-service';

interface IWinningSymbolsProps {
    settlementResult: gc.GameServiceMessage.TSettlementResult;
    settlementService: ISettlementResultService;
}

export const WinningSymbols: React.FC<IWinningSymbolsProps> = ({
    settlementResult,
    settlementService
}) => {
    if (!settlementResult) return null;

    const winningSymbols = settlementService.getWinningChoices(settlementResult);

    return (
        <>
            {winningSymbols.map((symbol, index) => (
                <FishPrawnCrabDot key={index} choice={symbol} size="small" />
            ))}
        </>
    );
}; 