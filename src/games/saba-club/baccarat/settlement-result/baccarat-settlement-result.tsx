import React from 'react';
import { observer } from '@sg/sg-observer';
import { setting } from '../game-settings';
import styles from './baccarat-settlement-result.module.scss';
import { IBaccaratResult } from '../type';

interface IBaccaratSettlementResultProps {
    namespace: string;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratSettlementResult extends React.Component<IBaccaratSettlementResultProps> {
    render() {
        // TODO: Get actual result from state
        const mockResult: IBaccaratResult = {
            playerScore: 0,
            bankerScore: 0,
            playerCards: [],
            bankerCards: [],
            winner: 'player'
        };

        return (
            <div className={styles['settlement-result']}>
                <div className={styles['cards-container']}>
                    <div className={styles['player-cards']}>
                        <h4>Player ({mockResult.playerScore})</h4>
                        <div className={styles['cards']}>
                            {mockResult.playerCards.map((card, index) => (
                                <div key={index} className={styles['card']}>
                                    {card}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles['banker-cards']}>
                        <h4>Banker ({mockResult.bankerScore})</h4>
                        <div className={styles['cards']}>
                            {mockResult.bankerCards.map((card, index) => (
                                <div key={index} className={styles['card']}>
                                    {card}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles[`winner-${mockResult.winner}`]}>
                    {mockResult.winner.toUpperCase()} WINS!
                </div>
            </div>
        );
    }
} 