import React from 'react';
import { observer } from '@sg/sg-observer';
import { setting } from '../game-settings';
import styles from './baccarat-bet-options.module.scss';
import { IBaccaratBet } from '../type';

interface IBaccaratBetOptionsProps {
    namespace: string;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratBetOptions extends React.Component<IBaccaratBetOptionsProps> {
    render() {
        return (
            <div className={styles['bet-options']}>
                <div className={styles['bet-option']}>
                    <button className={styles['bet-button']} onClick={() => this.placeBet('player')}>
                        Player
                    </button>
                </div>
                <div className={styles['bet-option']}>
                    <button className={styles['bet-button']} onClick={() => this.placeBet('banker')}>
                        Banker
                    </button>
                </div>
                <div className={styles['bet-option']}>
                    <button className={styles['bet-button']} onClick={() => this.placeBet('tie')}>
                        Tie
                    </button>
                </div>
                <div className={styles['bet-option']}>
                    <button className={styles['bet-button']} onClick={() => this.placeBet('playerPair')}>
                        Player Pair
                    </button>
                </div>
                <div className={styles['bet-option']}>
                    <button className={styles['bet-button']} onClick={() => this.placeBet('bankerPair')}>
                        Banker Pair
                    </button>
                </div>
            </div>
        );
    }

    private placeBet(type: IBaccaratBet['type']) {
        // TODO: Implement bet placement logic
        console.log(`Placing bet on ${type}`);
    }
} 