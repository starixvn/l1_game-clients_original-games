import React from 'react';
import { observer } from '@sg/sg-observer';
import { setting } from '../game-settings';
import styles from './baccarat-bet-options.module.scss';
import { IBaccaratBet } from '../type';
import BetOptions, { IBetOptionsState } from "../../../../_shared/components/bet-option";
import BettingBlock from "../../../../_shared/components/bet-option/betting-block";
import Odds from "../../../../_shared/components/bet-option/odd";

interface IBaccaratBetOptionsProps {
    namespace: string;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratBetOptions extends BetOptions {
    renderBetOption = (name: string, odd: number, betChoice: IBaccaratBet['type'], fractional: boolean) => {
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={this.props.namespace}>
                <div className={styles['bet-container']}>
                    <div className={styles['bet-name']}>{name}</div>
                    <div className={styles['bet-odd']}>
                        <Odds value={odd} fractional={fractional} />
                    </div>
                </div>
            </BettingBlock>
        );
    };

    render() {
        const { roundOdds } = this.state as IBetOptionsState;
        const odds = roundOdds?.odds || {};
        const fractional = roundOdds?.fractional;

        return (
            <div className={styles['bet-options-wrapper']}>
                <div className={styles['main-bets-container']}>
                    <div className={styles['bet-option']}>
                        {this.renderBetOption('Player', odds?.player || 2.00, 'player', !!fractional)}
                    </div>
                    <div className={styles['bet-option']}>
                        {this.renderBetOption('Banker', odds?.banker || 1.95, 'banker', !!fractional)}
                    </div>
                </div>
                <div className={styles['tie-container']}>
                    <div className={styles['bet-option']}>
                        {this.renderBetOption('Tie', odds?.tie || 9.00, 'tie', !!fractional)}
                    </div>
                </div>
                <div className={styles['pair-container']}>
                    <div className={styles['bet-option']}>
                        {this.renderBetOption('P.Pair', odds?.playerPair || 12.00, 'playerPair', !!fractional)}
                    </div>
                    <div className={styles['bet-option']}>
                        {this.renderBetOption('B.Pair', odds?.bankerPair || 12.00, 'bankerPair', !!fractional)}
                    </div>
                </div>
            </div>
        );
    }
} 