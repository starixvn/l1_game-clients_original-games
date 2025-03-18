import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../../../../_shared/components/observer-component/observer-component';
import Styles from './baccarat-round-history.module.scss';
import { BaccaratDot } from '../dot/baccarat-dot';
import { Choices } from '../baccarat-helper';

export interface IBaccaratRoundHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
}

export default class BaccaratRoundHistory extends ObserverComponent<IPropsObserver, IBaccaratRoundHistoryState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        this.setState({ rounds: rounds.slice(0, 10) });
    }

    private getWinningChoice(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        return [Choices.player, Choices.banker, Choices.tie].find((choice) => settlementResult[choice]) ?? '';
    }

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        if (!roundHistory.settlementResult) {
            return <></>;
        }
        const winningChoice = this.getWinningChoice(roundHistory.settlementResult);
        return (
            <div key={roundHistory.roundId} className={Styles['history-item']}>
                <BaccaratDot choice={winningChoice} />
                <span className={Styles['arrow']}></span>
            </div>
        );
    }

    render() {
        const { rounds } = this.state;
        if (!rounds || rounds.length === 0) {
            return <></>;
        }
        const t = (key) => gc.Translator.translate(key, { languageId: gc.Translator.getCurrentLanguageId() });
        return (
            <div className={Styles['round-history']}>
                <div className={Styles['round']}>
                    <div className={Styles['text']}>{t('Common.previous_round')}:</div>
                    {rounds.toReversed().map((roundHistory) => {
                        return this.RoundHistoryItem(roundHistory);
                    })}
                    <BaccaratDot highlight={true} value={'?'} choice="next" />
                </div>
            </div>
        );
    }
}
