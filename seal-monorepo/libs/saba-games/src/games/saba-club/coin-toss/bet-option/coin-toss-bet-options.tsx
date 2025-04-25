import { CoinTossSymbolType, CoinTossOddsType, coinChoices } from '../type';
import styles from './coin-toss-bet-options.module.scss';
import * as gc from '@sg/sg-game-client';
import BetOptions, { IBetOptionsState } from '../../../../_shared/components/bet-option';
import OddsComponent from '../../../../_shared/components/bet-option/odd-component';
import OwnBet from '../../../../_shared/components/bet-option/own-bet';
import TotalBet from '../../../../_shared/components/bet-option/total-bet';
import { ChoiceCoinTossIconMapper } from '../type';
import Coin from '../../../../_shared/components/coin';
// import CoinTossBettingBlock from './component/coin-toss-betting-block';

const symbols: CoinTossSymbolType[] = ['head', 'tail'];

export function BetOption() {
    return (
        <div className={styles.betOption}>
            <div className={styles.title}>Place Your Bets</div>
            <div className={styles.symbolsGrid}>
                {symbols.map((symbol) => (
                    <div key={symbol} className={styles.symbolCard}>
                        <div className={styles.symbolIcon}>{symbol}</div>
                        <div className={styles.betInput}>
                            <input type="number" placeholder="0" min="0" />
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.actions}>
                <button className={styles.clearButton}>Clear</button>
                <button className={styles.confirmButton}>Confirm</button>
            </div>
        </div>
    );
}

export default class CoinTossBetOptions extends BetOptions {

    renderBetOptions(betChoice: string, odd: number, fractional: boolean, name: string = '', isBoostedChoice: boolean = false) {
        const { settlementResult } = this.state;
        
        return (
            <div>CoinTossBetOptions</div>
            // <CoinTossBettingBlock
            //     odd={odd}
            //     betChoice={betChoice}
            //     gameName={this.props.gameName}
            //     namespace={this.props.namespace}
            //     settlementResult={settlementResult}
            //     onBet={this.props.onBet}
            // >
            //     <div className={`${Styles['container-bets']} ${Styles['padding-bet']}`}>
            //         <Coin coinType={ChoiceCoinTossIconMapper[betChoice]} />
            //         <OddsComponent value={odd} fractional={false} isBoostedChoice={isBoostedChoice} />
            //     </div>
            // </CoinTossBettingBlock>
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

        return (
            <div className={Styles['bet-options-wrapper']}>
                <div className={Styles['bet-options-container']}>
                    {coinChoices.map((choice) => {
                        const odd = odds?.[CoinTossOddsType.single] || 0;
                        return (
                            <div className={`${Styles['bets-bg']}`} key={choice}>
                                {this.renderBetOptions(
                                    choice,
                                    odd,
                                    fractional,
                                    '',
                                    this.isBoostedChoice(choice, boostedChoices)
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
} 