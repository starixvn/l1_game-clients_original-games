import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../../../../_shared/components/observer-component/observer-component';
import FishPrawnCrabDot from '../dot/fish-prawn-crab-dot';
import { FishPrawnCrabChoices, FishPrawnCrabSettlementResult } from '../type';
import styles from './fish-prawn-crab-result-history.module.scss';
import FishPrawnCrabDice from '../../../../_shared/components/fish-prawn-crab-dice';
import { Size } from '../../../../_shared/constants';

// Settlement Result Service - Single Responsibility Principle
class SettlementResultService {
    getSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult): FishPrawnCrabSettlementResult & { winner: FishPrawnCrabChoices } {
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

    getWinningChoices(settlementResult: gc.GameServiceMessage.TSettlementResult): FishPrawnCrabChoices[] {
        if (!settlementResult) return [];

        const settlement = this.getSettlementResult(settlementResult);
        return Object.entries(settlement)
            .filter(([key, value]) => key !== 'winner' && value === true)
            .map(([key]) => key as FishPrawnCrabChoices);
    }

    getWinningTextList(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        if (!settlementResult) return "";

        const winningSymbols = this.getWinningChoices(settlementResult)
            .map(choice => gc.Translator.translate(`FishPrawnCrab.glossary_${choice}`));

        return winningSymbols.join(', ');
    }
}

// Translation Service - Single Responsibility Principle
class TranslationService {
    translate(key: string): string {
        return gc.Translator.translate(key);
    }
}

// Components - Single Responsibility Principle
interface IDiceDisplayProps {
    result: gc.RoundHistories.RoundHistory['result'];
}

// Presentational Component - Single Responsibility
const DiceDisplay: React.FC<IDiceDisplayProps> = ({ result }) => {
    if (!result) return null;

    return (
        <div className={styles['dice-container']}>
            <FishPrawnCrabDice
                symbol={result["dice1"]}
                size={Size.small}
            />
            <FishPrawnCrabDice
                symbol={result["dice2"]}
                size={Size.small}
            />
            <FishPrawnCrabDice
                symbol={result["dice3"]}
                size={Size.small}
            />
        </div>
    );
};

interface IWinningSymbolsProps {
    settlementResult: gc.GameServiceMessage.TSettlementResult;
    settlementService: SettlementResultService;
}

// Presentational Component - Single Responsibility
const WinningSymbols: React.FC<IWinningSymbolsProps> = ({ settlementResult, settlementService }) => {
    if (!settlementResult) return null;

    const winningSymbols = settlementService.getWinningChoices(settlementResult);

    return (
        <>
            {winningSymbols.map((symbol, index) => (
                <FishPrawnCrabDot key={index} choice={symbol} size="small" />
            ))}
        </>
    );
};

interface IResultRowProps {
    roundHistory: gc.RoundHistories.RoundHistory;
    settlementService: SettlementResultService;
}

// Presentational Component - Single Responsibility
const ResultRow: React.FC<IResultRowProps> = ({ roundHistory, settlementService }) => {
    return (
        <tr>
            <td className={styles['round-cell']}>
                {`Round ${roundHistory.roundId}`}
            </td>
            <td className={styles['symbols-cell']}>
                {roundHistory.result && roundHistory.settlementResult && (
                    <DiceDisplay result={roundHistory.result} />
                )}
            </td>
            <td className={styles['result-cell']}>
                {roundHistory.settlementResult && (
                    settlementService.getWinningTextList(roundHistory.settlementResult)
                )}
            </td>
        </tr>
    );
};

export interface IFishPrawnCrabResultHistoryProps extends IPropsObserver {
    language: string;
    settlementsService?: SettlementResultService; // Dependency Injection
    translationService?: TranslationService; // Dependency Injection
}

export interface IFishPrawnCrabResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

const numberOfResult = 100;
export class FishPrawnCrabResultHistory extends ObserverComponent<IFishPrawnCrabResultHistoryProps, IFishPrawnCrabResultHistoryState> {
    private settlementService: SettlementResultService;
    private translationService: TranslationService;

    constructor(props: IFishPrawnCrabResultHistoryProps) {
        super(props);
        // Dependency Injection - services can be injected or use defaults
        this.settlementService = props.settlementsService || new SettlementResultService();
        this.translationService = props.translationService || new TranslationService();
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, numberOfResult) });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        const resultTitle = this.translationService.translate('Common.result_title');

        return (
            <div className={styles['resultHistoryContainer']}>
                <div className={styles['result-title']}>{resultTitle}</div>
                <div className={styles['resultHistory']}>
                    <div className={styles['result-wrapper-content']}>
                        <table className={styles['result-table']}>
                            <tbody>
                                {roundHistories.map((roundHistory, index) => (
                                    <ResultRow
                                        key={index}
                                        roundHistory={roundHistory}
                                        settlementService={this.settlementService}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
} 