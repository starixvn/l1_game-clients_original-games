import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../../../../_shared/components/observer-component/observer-component';
import FishPrawnCrabDot from '../dot/fish-prawn-crab-dot';
import { FishPrawnCrabChoices, FishPrawnCrabResult, FishPrawnCrabSettlementResult } from '../type';
import styles from './fish-prawn-crab-result-history.module.scss';

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

    renderSymbols = (roundHistory: gc.RoundHistories.RoundHistory) => {
        const settlementResult = roundHistory.settlementResult as unknown as FishPrawnCrabSettlementResult;
        const winningSymbols = Object.entries(settlementResult)
            .filter(([key, value]) => value === true)
            .map(([key]) => key as FishPrawnCrabChoices);

        return winningSymbols.map((symbol, index) => (
            <FishPrawnCrabDot key={index} choice={symbol} size="small" />
        ));
    };

    renderWinner(roundHistory: gc.RoundHistories.RoundHistory) {
        const { settlementResult } = roundHistory;
        if (!settlementResult) return null;

        const result = settlementResult as unknown as FishPrawnCrabSettlementResult;
        const winningSymbol = Object.entries(result)
            .find(([key, value]) => value === true)?.[0] as FishPrawnCrabChoices || FishPrawnCrabChoices.fish;

        const resultText = gc.Translator.translate(`FishPrawnCrab.${winningSymbol}`);
        return <div className={styles['result-text']}>{resultText}</div>;
    }

    renderRoundResult(roundHistory: gc.RoundHistories.RoundHistory, index: number) {
        return (
            <div className={styles['result-item']} key={index}>
                <RoundTitle roundId={roundHistory.roundId} />
                <div className={styles['symbols-result']}>
                    <div className={styles['item-dot']}>{this.renderSymbols(roundHistory)}</div>
                </div>
                <div>{this.renderWinner(roundHistory)}</div>
            </div>
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
            <div className={`c-ng-result ${styles['result-history']}`}>
                <div className={styles['result-title']}>{resultTitle}</div>
                <div className={styles['result-wrapper-content']}>
                    <div className={styles['result-content']}>
                        {roundHistories.map((roundHistory, index) => {
                            return this.renderRoundResult(roundHistory, index);
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export const RoundTitle: React.FC<{ roundId: number }> = ({ roundId }) => (
    <div>{`${gc.Translator.translate('Common.result_no')} ${roundId}`}</div>
); 