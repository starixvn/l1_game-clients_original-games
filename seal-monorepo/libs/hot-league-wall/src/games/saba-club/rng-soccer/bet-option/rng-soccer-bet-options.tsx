import { RNGSoccerChoices } from '../type';
import styles from '../rng-soccer.module.scss';
import rngSoccerStyles from './rng-soccer-bet-options.module.scss';
import * as gc from '@sg/sg-game-client';
import BetOptions, { IBetOptionsState } from '../../../../_shared/components/bet-option';
import OddsComponent from '../../../../_shared/components/bet-option/odd-component';
import BettingBlock from '../../../../_shared/components/bet-option/betting-block';

interface RNGSoccerBetOptionsProps {
    gameName: string;
    namespace: string;
    language: string;
    onBet: (symbol: string, amount: number) => void;
}

export default class RNGSoccerBetOptions extends BetOptions {
    renderBetOptions(betChoice: string, odd: number, name: string = '', isBoostedChoice: boolean = false) {
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
                    <span className={rngSoccerStyles['bet-choice-text']} title={name}>{name}</span>
                    <OddsComponent value={odd} fractional={false} isBoostedChoice={isBoostedChoice} />
                </div>
            </BettingBlock>
        );
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
        const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

        const homeChoice = RNGSoccerChoices.home;
        const awayChoice = RNGSoccerChoices.away;
        const drawChoice = RNGSoccerChoices.draw;

        return (
            <div className={rngSoccerStyles['bet-options-wrapper']}>
                <div className={rngSoccerStyles['bet-options-container']}>
                    <div className={rngSoccerStyles['bets-bg']} key={homeChoice}>
                        {this.renderBetOptions(
                            homeChoice,
                            odds?.home || 0,
                            t(`${this.props.namespace}.${homeChoice}`),
                            this.isBoostedChoice(homeChoice, boostedChoices)
                        )}
                    </div>
                    <div className={rngSoccerStyles['bets-bg']} key={drawChoice}>
                        {this.renderBetOptions(
                            drawChoice,
                            odds?.draw || 0,
                            t(`${this.props.namespace}.${drawChoice}`),
                            this.isBoostedChoice(drawChoice, boostedChoices)
                        )}
                    </div>
                    <div className={rngSoccerStyles['bets-bg']} key={awayChoice}>
                        {this.renderBetOptions(
                            awayChoice,
                            odds?.away || 0,
                            t(`${this.props.namespace}.${awayChoice}`),
                            this.isBoostedChoice(awayChoice, boostedChoices)
                        )}
                    </div>
                </div>
            </div>
        );
    }
} 