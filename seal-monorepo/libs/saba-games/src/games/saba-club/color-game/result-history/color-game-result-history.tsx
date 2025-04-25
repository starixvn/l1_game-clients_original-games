import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../../../../_shared/components/observer-component/observer-component';
import { ISettlementResultService, SettlementResultService, ITranslationService, TranslationService } from '../services';
import { ResultRow } from './components';
import styles from './color-game-result-history.module.scss';

export interface IColorGameResultHistoryProps extends IPropsObserver {
    language: string;
    settlementService?: ISettlementResultService;
    translationService?: ITranslationService;
}

export interface IColorGameResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
    fullRoundHistory: gc.RoundHistories.RoundHistory[];
}

const numberOfResult = 100;

export class ColorGameResultHistory extends ObserverComponent<IColorGameResultHistoryProps, IColorGameResultHistoryState> {
    private settlementService: ISettlementResultService;
    private translationService: ITranslationService;

    constructor(props: IColorGameResultHistoryProps) {
        super(props);
        this.state = {
            dispose: null,
            rounds: [],
            fullRoundHistory: [],
        };

        this.settlementService = props.settlementService || new SettlementResultService();
        this.translationService = props.translationService || new TranslationService();
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedPlayAnimation)
    finishPlayAnimation(isFinishedPlayAnimation: boolean) {
        isFinishedPlayAnimation && this.setState({ rounds: [...this.state.fullRoundHistory] });
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ fullRoundHistory: rounds });
        if (this.state.rounds.length === 0) {
            this.setState({ rounds });
        }
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