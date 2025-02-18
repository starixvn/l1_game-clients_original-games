import React from 'react';
import { SettlementResult } from "../../baccarat";
import Styles from "./baccarat-animations.module.scss";

interface SettlementInfoProps {
    settlementResult: SettlementResult;
    resources: Record<string, string>;
    isShowTicketHistory?: boolean;
}

export const SettlementInfo: React.FC<SettlementInfoProps> = ({
    settlementResult,
    resources,
    isShowTicketHistory = false
}) => {
    const resultCount = 2 + (settlementResult.playerPair ? 1 : 0) + (settlementResult.bankerPair ? 1 : 0);
    const classResultCount = `result-${resultCount}`;

    return (
        <div className={`${Styles["result-container"]} ${Styles[classResultCount]} ${isShowTicketHistory && Styles["ticket-history"]}`}>
            {settlementResult.player ? (
                <div className={Styles["result-info-blue"]}>{resources["player"]}</div>
            ) : settlementResult.banker ? (
                <div className={Styles["result-info-red"]}>{resources["banker"]}</div>
            ) : (
                <div className={Styles["result-info-green"]}>{resources["tie"]}</div>
            )}
            {settlementResult.big ? (
                <div className={Styles["result-info-blue"]}>{resources["big"]}</div>
            ) : (
                <div className={Styles["result-info-red"]}>{resources["small"]}</div>
            )}
            {settlementResult.playerPair && (
                <div className={`${Styles["result-info-blue"]} ${Styles["result-player-pair"]}`}>
                    {resources["playerPair"]}
                </div>
            )}
            {settlementResult.bankerPair && (
                <div className={`${Styles["result-info-red"]} ${Styles["result-banker-pair"]}`}>
                    {resources["bankerPair"]}
                </div>
            )}
        </div>
    );
}; 