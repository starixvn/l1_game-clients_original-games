import React from 'react';
import { observer } from '@sg/sg-observer';
import { setting } from '../game-settings';
import styles from './baccarat-round-history.module.scss';
import { IBaccaratResult } from '../type';

interface IBaccaratRoundHistoryProps {
    namespace: string;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratRoundHistory extends React.Component<IBaccaratRoundHistoryProps> {
    render() {
        // TODO: Get actual round history from state
        const mockHistory: IBaccaratResult[] = [];

        return null;
        return (
            <div className={styles['round-history']}>
                <h3>Round History</h3>
                <div className={styles['history-grid']}>
                    {mockHistory.map((result, index) => (
                        <div key={index} className={styles['history-item']}>
                            <div className={styles[`winner-${result.winner}`]}>
                                {result.winner.toUpperCase()}
                            </div>
                            <div className={styles['scores']}>
                                P: {result.playerScore} - B: {result.bankerScore}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
} 