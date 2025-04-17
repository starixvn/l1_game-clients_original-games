import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../../../../_shared/components/observer-component/observer-component';
import FishPrawnCrabDot from '../dot/fish-prawn-crab-dot';
import { FishPrawnCrabChoices, FishPrawnCrabSettlementResult } from '../type';
import styles from './fish-prawn-crab-result-history.module.scss';
import FishPrawnCrabDice, { FishPrawnCrabSymbol } from '../../../../_shared/components/fish-prawn-crab-dice';
import { Size } from '../../../../_shared/constants';

export interface IFishPrawnCrabResultHistoryProps extends IPropsObserver {
    language: string;
}

export interface IFishPrawnCrabResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

const numberOfResult = 100;
export class FishPrawnCrabResultHistory extends ObserverComponent<IFishPrawnCrabResultHistoryProps, IFishPrawnCrabResultHistoryState> {
    constructor(props: IFishPrawnCrabResultHistoryProps) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, numberOfResult) });
    }

    private getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): FishPrawnCrabSettlementResult & { winner: FishPrawnCrabChoices } {
        const result = {
            winner: FishPrawnCrabChoices.fish,
            [FishPrawnCrabChoices.fish]: false,
            [FishPrawnCrabChoices.prawn]: false,
            [FishPrawnCrabChoices.crab]: false,
            [FishPrawnCrabChoices.rooster]: false,
            [FishPrawnCrabChoices.gourd]: false,
            [FishPrawnCrabChoices.stag]: false
        };

        if (settlementResult && typeof settlementResult === "object") {
            const data = settlementResult as Record<string, unknown>;

            // Process each choice
            Object.values(FishPrawnCrabChoices).forEach(choice => {
                result[choice] = !!data[choice];
                if (result[choice]) {
                    result.winner = choice;
                }
            });
        }

        return result;
    }

    renderSymbols = (roundHistory: gc.RoundHistories.RoundHistory) => {
        if (!roundHistory.settlementResult || !roundHistory.result) return null;

        return (
            <div className={styles['dice-container']}>
                <FishPrawnCrabDice
                    symbol={roundHistory.result["dice1"]}
                    size={Size.small}
                />
                <FishPrawnCrabDice
                    symbol={roundHistory.result["dice2"]}
                    size={Size.small}
                />
                <FishPrawnCrabDice
                    symbol={roundHistory.result["dice3"]}
                    size={Size.small}
                />
            </div>
        );
    };

    renderWinningSymbols = (roundHistory: gc.RoundHistories.RoundHistory) => {
        if (!roundHistory.settlementResult) return null;

        const settlement = this.getSettlementResult(roundHistory.settlementResult);
        const winningSymbols = Object.entries(settlement)
            .filter(([key, value]) => key !== 'winner' && value === true)
            .map(([key]) => key as FishPrawnCrabChoices);

        return winningSymbols.map((symbol, index) => (
            <FishPrawnCrabDot key={index} choice={symbol} size="small" />
        ));
    };

    getWinningTextList(roundHistory: gc.RoundHistories.RoundHistory) {
        if (!roundHistory.settlementResult) return "";

        const settlement = this.getSettlementResult(roundHistory.settlementResult);
        const winningSymbols = Object.entries(settlement)
            .filter(([key, value]) => key !== 'winner' && value === true)
            .map(([key]) => {
                const choice = key as FishPrawnCrabChoices;
                return gc.Translator.translate(`FishPrawnCrab.glossary_${choice}`);
            });

        return winningSymbols.join(', ');
    }

    renderTableRow(roundHistory: gc.RoundHistories.RoundHistory, index: number) {
        return (
            <tr key={index} className={index % 2 === 0 ? styles['row-even'] : styles['row-odd']}>
                <td className={styles['round-cell']}>
                    {`Round ${roundHistory.roundId}`}
                </td>
                <td className={styles['symbols-cell']}>
                    {this.renderSymbols(roundHistory)}
                </td>
                <td className={styles['result-cell']}>
                    {this.getWinningTextList(roundHistory)}
                </td>
            </tr>
        );
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        const resultTitle = gc.Translator.translate('Common.result_title');

        return (
            <div className={styles['result-history']}>
                <div className={styles['result-title']}>{resultTitle}</div>
                <div className={styles['result-wrapper-content']}>
                    <table className={styles['result-table']}>
                        <tbody>
                            {roundHistories.map((roundHistory, index) => {
                                return this.renderTableRow(roundHistory, index);
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
} 