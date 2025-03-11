import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import { RoundDot } from '../../../../_shared/components/dot';
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from '../../../../_shared/components/observer-component/observer-component';
import Styles from '../sedie.module.scss';
import { SeDieChoices } from '../type';

export interface ISeDieRoundHistoryProps extends IPropsObserver {
    language: string;
}

export interface ISeDieRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}
export default class SeDieRoundHistory extends ObserverComponent<ISeDieRoundHistoryProps, ISeDieRoundHistoryState> {
    constructor(props: ISeDieRoundHistoryProps) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, 10) });
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const roundHistories = rounds as gc.RoundHistories.RoundHistory[];
        const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });
        
        return (
            <div className={Styles['round-history']}>
                <div className={Styles['hstack-round']}>
                    {t('Common.previous_round')}:
                    {roundHistories.toReversed().map((roundHistory) => {
                        return this.RoundHistoryItem(roundHistory);
                    })}
                    <RoundDot highlight={true} size='large' value={'?'} />
                </div>
            </div>
        );
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const value = this.getResult(roundHistory.settlementResult);
        const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });
        const choice = value === 'O' ? SeDieChoices.odd : SeDieChoices.even;
        const dotValue = t(`SeDie.beadboard_${choice}`);
        const isOdd = value === 'O';

        return (
            <div className={Styles['hstack']} key={roundHistory.roundId}>
                <RoundDot choice={isOdd ? SeDieChoices.odd : SeDieChoices.even} size='large' value={dotValue} />
                <span className={Styles['arrow']}></span>
            </div>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        let value = '';
        settlementResult &&
            Object.keys(settlementResult).map((choice) => {
                if (settlementResult[choice]) {
                    if (choice === SeDieChoices.odd || choice === SeDieChoices.even) {
                        value = choice.charAt(0).toUpperCase();
                    }
                }
            });
        return value;
    }
}
