import React from 'react';
import { observer } from '@sg/sg-observer';
import { RNGSoccerChoices } from '../type';
import styles from '../rng-soccer.module.scss';
import rngSoccerStyles from './rng-soccer-bet-options.module.scss';
import * as gc from '@sg/sg-game-client';
import BetOptions, { IBetOptionsState } from '../../../../_shared/components/bet-option';
import OddsComponent from '../../../../_shared/components/bet-option/odd-component';
import OwnBet from '../../../../_shared/components/bet-option/own-bet';
import TotalBet from '../../../../_shared/components/bet-option/total-bet';
import BettingBlock from '../../../../_shared/components/bet-option/betting-block';

interface RNGSoccerBetOptionsProps {
    gameName: string;
    namespace: string;
    language: string;
    onBet: (symbol: string, amount: number) => void;
}

export default class RNGSoccerBetOptions extends BetOptions {
    renderBetOptions(betChoice: string, odd: number, fractional: boolean, name: string = '', isBoostedChoice: boolean = false) {
        const { settlementResult } = this.state;

        return (
            <BettingBlock
                odd={odd}
                betChoice={betChoice}
                gameName={this.props.gameName}
                namespace={this.props.namespace}
                settlementResult={settlementResult}
                onBet={this.props.onBet}
            >
                <div className={`${styles['container-bets']} ${rngSoccerStyles['padding-bet']}`}>
                    <div className={rngSoccerStyles['bet-option']}>
                        <div className={rngSoccerStyles['bet-choice-text']}>{name}</div>
                    </div>
                    <OddsComponent value={odd} fractional={false} isBoostedChoice={isBoostedChoice} />
                </div>
            </BettingBlock>
        );
    }

    renderTotalBet(choice: string) {
        return <TotalBet value={this.state?.totalBets?.[choice]} choice={choice} />;
    }

    renderOwnBet(choice: string) {
        return <OwnBet value={this.state?.ownBets?.[choice]} choice={choice} />;
    }

    isBoostedChoice = (choice: string, boostedChoices: string[] | null) => {
        if (!boostedChoices) {
            return false;
        }
        return boostedChoices.includes(choice);
    };

    render() {
        const { roundOdds, boostedOdds } = this.state as IBetOptionsState;
        const odds = roundOdds?.odds || {};
        const boostedChoices = boostedOdds ? boostedOdds.boostedChoices : roundOdds?.boostedChoices;
        const fractional = roundOdds?.fractional;

        const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });
        const homeChoice = RNGSoccerChoices.home;
        const awayChoice = RNGSoccerChoices.away;
        const drawChoice = RNGSoccerChoices.draw;

        return (
            <div className={rngSoccerStyles['bet-options-wrapper']}>
                <div className={rngSoccerStyles['bet-options-container']}>
                    <div className={`${rngSoccerStyles['bets-bg']}`} key={homeChoice}>
                        {this.renderBetOptions(
                            homeChoice,
                            odds?.home || 0,
                            fractional,
                            t(`${this.props.namespace}.${homeChoice}`),
                            this.isBoostedChoice(homeChoice, boostedChoices)
                        )}
                    </div>
                    <div className={`${rngSoccerStyles['bets-bg']}`} key={drawChoice}>
                        {this.renderBetOptions(
                            drawChoice,
                            odds?.draw || 0,
                            fractional,
                            t(`${this.props.namespace}.${drawChoice}`),
                            this.isBoostedChoice(drawChoice, boostedChoices)
                        )}
                    </div>
                    <div className={`${rngSoccerStyles['bets-bg']}`} key={awayChoice}>
                        {this.renderBetOptions(
                            awayChoice,
                            odds?.away || 0,
                            fractional,
                            t(`${this.props.namespace}.${awayChoice}`),
                            this.isBoostedChoice(awayChoice, boostedChoices)
                        )}
                    </div>
                </div>
            </div>
        );
    }
} 