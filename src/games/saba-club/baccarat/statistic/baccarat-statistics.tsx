import React from 'react';
import { observer } from '@sg/sg-observer';
import { setting } from '../game-settings';
import styles from './baccarat-statistics.module.scss';

interface IBaccaratStatisticsProps {
    namespace: string;
}

interface IStatistics {
    playerWins: number;
    bankerWins: number;
    ties: number;
    playerPairs: number;
    bankerPairs: number;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratStatistics extends React.Component<IBaccaratStatisticsProps> {
    render() {
        // TODO: Get actual statistics from state
        const mockStats: IStatistics = {
            playerWins: 0,
            bankerWins: 0,
            ties: 0,
            playerPairs: 0,
            bankerPairs: 0
        };

        return (
            <div className={styles['statistics']}>
                <h3>Statistics</h3>
                <div className={styles['stats-grid']}>
                    <div className={styles['stat-item']}>
                        <div className={styles['label']}>Player Wins</div>
                        <div className={styles['value']}>{mockStats.playerWins}</div>
                    </div>
                    <div className={styles['stat-item']}>
                        <div className={styles['label']}>Banker Wins</div>
                        <div className={styles['value']}>{mockStats.bankerWins}</div>
                    </div>
                    <div className={styles['stat-item']}>
                        <div className={styles['label']}>Ties</div>
                        <div className={styles['value']}>{mockStats.ties}</div>
                    </div>
                    <div className={styles['stat-item']}>
                        <div className={styles['label']}>Player Pairs</div>
                        <div className={styles['value']}>{mockStats.playerPairs}</div>
                    </div>
                    <div className={styles['stat-item']}>
                        <div className={styles['label']}>Banker Pairs</div>
                        <div className={styles['value']}>{mockStats.bankerPairs}</div>
                    </div>
                </div>
            </div>
        );
    }
} 