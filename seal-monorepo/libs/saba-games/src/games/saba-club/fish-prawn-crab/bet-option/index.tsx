import React from 'react';
import { FishPrawnCrabSymbol } from '../type';
import styles from './bet-option.module.scss';
import * as gc from '@sg/sg-game-client';
import BetOptions, { IBetOptionsState } from '../../../../_shared/components/bet-option';
import BettingBlock from '../../../../_shared/components/bet-option/betting-block';
import OddsComponent from '../../../../_shared/components/bet-option/odd-component';
import OwnBet from '../../../../_shared/components/bet-option/own-bet';
import TotalBet from '../../../../_shared/components/bet-option/total-bet';
import { RoundDot } from '../../../../_shared/components/dot';
import Styles from '../fish-prawn-crab.module.scss';
import { bottomChoices, ChoiceFishPrawnCrabIconMapper, FishPrawnCrabChoices, mainChoices, topChoices } from '../type';

const symbols: FishPrawnCrabSymbol[] = ['fish', 'prawn', 'crab', 'rooster', 'gourd', 'coin'];

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

export default class FishPrawnCrabBetOptions extends BetOptions {
    protected renderDots(dots: boolean[]) {
        return dots.map((isActive, index) => (
            <RoundDot key={index} choice={isActive ? FishPrawnCrabChoices.fish : FishPrawnCrabChoices.prawn} size="small" />
        ));
    }

    renderSubOptions(betChoice: string, odd: number, fractional: boolean, name: string = '', isBoostedChoice: boolean = false) {
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
                <div className={`${Styles['container-bets']} ${Styles['padding-bet']}`}>
                    <div className={`${Styles['wrapper-dots']} ${Styles['wrapper-dots-small']}`}>
                        {this.renderDots(ChoiceFishPrawnCrabIconMapper[betChoice])}
                    </div>
                    <OddsComponent value={odd} fractional={false} isBoostedChoice={isBoostedChoice} />
                </div>
            </BettingBlock>
        );
    }

    renderMainOption(name: string, odd: number, betChoice: string, fractional: boolean, isBoostedChoice: boolean = false) {
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
                <div className={`${Styles['container-bets']} ${Styles['padding-bet']}`}>
                    <div>
                        <div className={Styles['main-option']}>{name}</div>
                    </div>
                    <div>
                        <OddsComponent value={odd} fractional={false} isBoostedChoice={isBoostedChoice} />
                    </div>
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
        const odds = boostedOdds ? boostedOdds.values : roundOdds?.odds;
        const boostedChoices = boostedOdds ? boostedOdds.boostedChoices : roundOdds?.boostedChoices;
        const fractional = roundOdds?.fractional;

        const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });

        return (
            <div className={Styles['bet-options-wrapper']}>
                <div className={Styles['bet-options-container-left']}>
                    {mainChoices.map((choice) => {
                        const choiceName = t(`FishPrawnCrab.glossary_${choice}`);
                        const odd = odds?.[choice] || 0;
                        return (
                            <div className={`${Styles['bet']} ${Styles['bets-bg']}`} key={choice}>
                                {this.renderMainOption(
                                    choiceName,
                                    odd,
                                    choice,
                                    fractional,
                                    this.isBoostedChoice(choice, boostedChoices)
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className={Styles['bet-options-container-right']}>
                    {topChoices.map((choice) => {
                        const odd = odds?.[choice] || 0;
                        return (
                            <div className={`${Styles['bets-bg']}`} key={choice}>
                                {this.renderSubOptions(
                                    choice,
                                    odd,
                                    fractional,
                                    '',
                                    this.isBoostedChoice(choice, boostedChoices)
                                )}
                            </div>
                        );
                    })}
                    {bottomChoices.map((choice) => {
                        const odd = odds?.[choice] || 0;
                        return (
                            <div className={`${Styles['bets-bg']}`} key={choice}>
                                {this.renderSubOptions(
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