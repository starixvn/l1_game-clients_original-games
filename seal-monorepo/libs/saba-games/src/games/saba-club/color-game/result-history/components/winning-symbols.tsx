import React from 'react';
import * as gc from '@sg/sg-game-client';
import ColorGameDot from '../../dot/color-game-dot';
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
                <ColorGameDot key={index} choice={symbol} size="small" />
            ))}
        </>
    );
}; 