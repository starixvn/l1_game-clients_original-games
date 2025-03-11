import React from 'react';
import { observer } from '@sg/sg-observer';
import { setting } from '../game-settings';
import styles from './baccarat-bet-options.module.scss';
import { IBaccaratBet } from '../type';
import BetOptions, { IBetOptionsState } from "../../../../_shared/components/bet-option";
import BettingBlock from "../../../../_shared/components/bet-option/betting-block";
import Odds from "../../../../_shared/components/bet-option/odd";
import OwnBet from "../../../../_shared/components/bet-option/own-bet";
import TotalBet from "../../../../_shared/components/bet-option/total-bet";
import { IPropsObserver } from "../../../../_shared/components/observer-component/observer-component";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import * as gc from "@sg/sg-game-client";

interface IBaccaratBetOptionsProps extends IPropsObserver {
    previousWinningBet?: IBaccaratBet['type'];
    roundState: string;
}

interface BetOptionProps {
    odd: number;
    betChoice: IBaccaratBet['type'];
    name: string;
    fractional: boolean;
    isBoostedChoice: boolean;
    isWinningBet?: boolean;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratBetOptions extends BetOptions {
    declare props: IBaccaratBetOptionsProps;

    private isDisabled(): boolean {
        const { roundState } = this.props;
        return roundState === ROUND_STATE.SHOW_RESULT || roundState === ROUND_STATE.LOCKING_BET;
    }

    private renderBetOptionContent({ odd, name, fractional, isBoostedChoice }: BetOptionProps) {
        return (
            <div className={styles['bet-container']}>
                <div className={styles['bet-name']}>{name}</div>
                <div className={styles['bet-odd']}>
                    <Odds
                        value={odd}
                        fractional={fractional}
                        isBoostedChoice={isBoostedChoice}
                    />
                </div>
            </div>
        );
    }

    private renderBetOption(props: BetOptionProps) {
        const { odd, betChoice } = props;
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={this.props.namespace}>
                {this.renderBetOptionContent(props)}
            </BettingBlock>
        );
    }

    public renderTotalBet(choice: string) {
        return <TotalBet value={this.state?.totalBets?.[choice]} choice={choice} />;
    }

    public renderOwnBet(choice: string) {
        return <OwnBet value={this.state?.ownBets?.[choice]} choice={choice} />;
    }

    private isBoostedChoice(choice: string, boostedChoices: string[] | undefined): boolean {
        return boostedChoices ? boostedChoices.includes(choice) : false;
    }

    render() {
        const { roundOdds, boostedOdds } = this.state as IBetOptionsState;
        const { previousWinningBet } = this.props;
        const odds = roundOdds?.odds || {};
        const boostedChoices = roundOdds?.boostedChoices;
        const fractional = roundOdds?.fractional;
        const isDisabled = this.isDisabled();

        return (
            <div className={`${styles['bet-options-wrapper']} ${isDisabled ? styles['bet-options-disabled'] : ''}`}>
                <div className={styles['main-bets-container']}>
                    <div className={`${styles['bet-option']} ${previousWinningBet === 'player' ? styles['winning-bet'] : ''}`}>
                        {this.renderBetOption({
                            name: gc.Translator.t('Baccarat.glossary_player'),
                            odd: odds?.player,
                            betChoice: 'player',
                            fractional: !!fractional,
                            isBoostedChoice: this.isBoostedChoice('player', boostedChoices)
                        })}
                        {this.renderTotalBet('player')}
                        {this.renderOwnBet('player')}
                    </div>
                    <div className={`${styles['bet-option']} ${previousWinningBet === 'banker' ? styles['winning-bet'] : ''}`}>
                        {this.renderBetOption({
                            name: gc.Translator.t('Baccarat.glossary_banker'),
                            odd: odds?.banker,
                            betChoice: 'banker',
                            fractional: !!fractional,
                            isBoostedChoice: this.isBoostedChoice('banker', boostedChoices)
                        })}
                        {this.renderTotalBet('banker')}
                        {this.renderOwnBet('banker')}
                    </div>
                </div>
                <div className={styles['tie-container']}>
                    <div className={`${styles['bet-option']} ${previousWinningBet === 'tie' ? styles['winning-bet'] : ''}`}>
                        {this.renderBetOption({
                            name: gc.Translator.t('Baccarat.glossary_tie'),
                            odd: odds?.tie,
                            betChoice: 'tie',
                            fractional: !!fractional,
                            isBoostedChoice: this.isBoostedChoice('tie', boostedChoices)
                        })}
                        {this.renderTotalBet('tie')}
                        {this.renderOwnBet('tie')}
                    </div>
                </div>
                <div className={styles['pair-container']}>
                    <div className={`${styles['bet-option']} ${previousWinningBet === 'playerPair' ? styles['winning-bet'] : ''}`}>
                        {this.renderBetOption({
                            name: gc.Translator.t('Baccarat.glossary_playerPair'),
                            odd: odds?.playerPair,
                            betChoice: 'playerPair',
                            fractional: !!fractional,
                            isBoostedChoice: this.isBoostedChoice('playerPair', boostedChoices)
                        })}
                        {this.renderTotalBet('playerPair')}
                        {this.renderOwnBet('playerPair')}
                    </div>
                    <div className={`${styles['bet-option']} ${previousWinningBet === 'bankerPair' ? styles['winning-bet'] : ''}`}>
                        {this.renderBetOption({
                            name: gc.Translator.t('Baccarat.glossary_bankerPair'),
                            odd: odds?.bankerPair,
                            betChoice: 'bankerPair',
                            fractional: !!fractional,
                            isBoostedChoice: this.isBoostedChoice('bankerPair', boostedChoices)
                        })}
                        {this.renderTotalBet('bankerPair')}
                        {this.renderOwnBet('bankerPair')}
                    </div>
                </div>
            </div>
        );
    }
} 