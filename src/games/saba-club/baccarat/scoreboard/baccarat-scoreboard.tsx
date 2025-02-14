import React from 'react';
import { observer } from '@sg/sg-observer';
import { setting } from '../game-settings';
import styles from './baccarat-scoreboard.module.scss';
import { IBaccaratResult } from '../type';

interface IBaccaratScoreboardProps {
    namespace: string;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratScoreboard extends React.Component<IBaccaratScoreboardProps> {
    render() {
        // TODO: Get actual results from state
        const mockResults: IBaccaratResult[] = [];
        return null;
        return (
            <div className={styles['scoreboard']}>
                <h3>Scoreboard</h3>
                <div className={styles['board']}>
                    {mockResults.map((result, index) => (
                        <div key={index} className={styles['result-dot']}>
                            <div className={styles[`dot-${result.winner}`]} />
                        </div>
                    ))}
                </div>
                <div className={styles['legend']}>
                    <div className={styles['legend-item']}>
                        <div className={styles['dot-player']} />
                        <span>Player</span>
                    </div>
                    <div className={styles['legend-item']}>
                        <div className={styles['dot-banker']} />
                        <span>Banker</span>
                    </div>
                    <div className={styles['legend-item']}>
                        <div className={styles['dot-tie']} />
                        <span>Tie</span>
                    </div>
                </div>
            </div>
        );
    }
} 