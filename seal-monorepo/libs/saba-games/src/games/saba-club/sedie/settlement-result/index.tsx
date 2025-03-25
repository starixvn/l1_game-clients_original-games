import * as gc from '@sg/sg-game-client';
import { RoundHistoryStore } from '@sg/sg-game-client/dist/game/round-histories';
import { ROUND_STATE, RoundTimeStore } from '@sg/sg-game-client/dist/game/rounds';
import { SettlementStore } from '@sg/sg-game-client/dist/game/settlements';
import { render } from '@sg/sg-observer';
// import { Col, Row } from 'react-bootstrap';
import { RoundDot } from '../../../../_shared/components/dot';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../../../../_shared/components/observer-component/observer-component';
import Styles from './sedie-animations.module.scss';
import { WinnerDisplay } from 'libs/saba-games/src/_shared/components/winner-display/winner-display';
import { gameStateService } from './services/game-state.service';
import { SedieResult } from '../type';

export interface ISeDieSettlementResultState extends IStateObserver {
    result: gc.GameServiceMessage.TResult;
    roundState: string;
    isAnimationResult: boolean;
    win: number;
    isFinishShowResult: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
}

export default class SeDieSettlementResult extends ObserverComponent<IPropsObserver, ISeDieSettlementResultState> {

    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: {},
            roundState: '',
            isAnimationResult: false,
            win: 0,
            isFinishShowResult: false,
            settlementResult: {}
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    handleRoundState(roundState: string) {
        this.setState({ roundState });
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) {
            return;
        }
        const { result, settlementResult } = currentFinish;

        if (!result || !settlementResult) {
            return;
        }

        this.setState({ result, isAnimationResult: true, settlementResult });
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }
        const result = gameStateService.handleGameHistory(firstJoinGameHistory);
        if (result && gameStateService.validateResult(result as SedieResult)) {
            this.setState({
                result,
                isFinishShowResult: true
            });
        }
        const lastRound = firstJoinGameHistory?.roundHistory;
        if (lastRound) {
            this.setState({ result: lastRound?.result, settlementResult: lastRound?.settlementResult });
        }
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    finishShowResult(isFinishedShowResult: boolean) {
        this.setState({ isFinishShowResult: isFinishedShowResult });
    }



    @render(gc.Settlements.SettlementStatusStore, (store) => store.settlementStatus, {
        fireImmediately: false,
    })
    assignStatus(settlementStatus: any) {
        this.setState({ win: settlementStatus.bet });
    }

    renderWinnerDisplay = () => {
        const { settlementResult, isFinishShowResult } = this.state;
        const result = settlementResult.odd ? gc.Translator.t('SeDie.glossary_odd', { lng: this.props.language || '' }) : gc.Translator.t('SeDie.glossary_even', { lng: this.props.language || '' });
        const resultText = gc.Translator.t('Common.win', { lng: this.props.language || '' });
        return isFinishShowResult && <WinnerDisplay result={result} resultText={resultText} className={Styles['sedie-result']} />
    }

    renderIcons = (result: gc.GameServiceMessage.TResult) => {
        return (
            <div className={`${Styles['container-bets']} ${this.state.isAnimationResult ? Styles['has-animation'] : ''}`}>
                <div className={Styles['result-container']}>
                    {Object.values(result).map((value, index) => {
                        const resultClass = `dot-3d-${index + 1}`;
                        return (
                            <div className={Styles['result-item']} key={resultClass}>
                                <div className={`${Styles[resultClass]} ${index % 2 ? Styles['option1'] : Styles['option2']}`}>
                                    <span className={Styles['dot-3d-front-inside']}></span>
                                    <span className={Styles['dot-3d-front']}></span>
                                    <span className={Styles['dot-3d-back_inside']}></span>
                                    <span className={Styles['dot-3d-back']}></span>
                                </div>
                                <div key={index} className={Styles[`result-sedie-dot${index + 1}`]}>
                                    <div className={`${value ? Styles['result-dot-red'] : Styles['result-dot-white']}`}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {this.renderWinnerDisplay()}
            </div>
        );
    };

    renderNoResultIcons = (): JSX.Element => {
        return (
            <div className={Styles['result-container']}>
                <RoundDot highlight={true} size="large" value={'?'} />
                <RoundDot highlight={true} size="large" value={'?'} />
                <RoundDot highlight={true} size="large" value={'?'} />
                <RoundDot highlight={true} size="large" value={'?'} />
            </div>
        );
    };

    render() {
        const isEmpty = (obj: object): boolean => {
            return JSON.stringify(obj) === '{}';
        };

        const { result, roundState } = this.state;

        if (!result || isEmpty(result as object) || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            return this.renderNoResultIcons();
        }
        return (
            <div>
                <div>{this.renderIcons(result)}</div>
            </div>
        );
    }
}
