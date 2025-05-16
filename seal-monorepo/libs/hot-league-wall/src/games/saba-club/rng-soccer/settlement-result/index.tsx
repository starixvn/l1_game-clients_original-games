import * as gc from "@sg/sg-game-client";
import { Settlements } from '@sg/sg-game-client';
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render, handle, observer } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { RNGSoccerResult, RNGSoccerChoices } from "../type";
import Styles from "./rng-soccer-animations.module.scss";
import { Size } from "../../../../_shared/constants";
import { ResultDisplay } from "./result-display";

const DEFAULT_RESULT = {};

const POP_UP_ANIMATION_DURATION = 0.3;

export interface IRNGSoccerSettlementResultState extends IStateObserver {
    result: gc.GameServiceMessage.TResult;
    roundState: string;
    isAnimationResult: boolean;
    isFinishShowResult: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
    winningSymbols: string[];
    isResultUpdated: boolean;
    dispose: () => void;
}

@observer
export default class RNGSoccerSettlementResult extends ObserverComponent<IPropsObserver, IRNGSoccerSettlementResultState> {
    private roundTimeStore: RoundTimeStore;
    private roundHistoryStore: RoundHistoryStore;
    private settlementStore: SettlementStore;

    constructor(props: IPropsObserver) {
        super(props);
        this.roundTimeStore = gc.getContainer().get(RoundTimeStore);
        this.roundHistoryStore = gc.getContainer().get(RoundHistoryStore);
        this.settlementStore = gc.getContainer().get(SettlementStore);

        this.state = {
            result: DEFAULT_RESULT,
            roundState: this.roundTimeStore.roundState,
            isAnimationResult: false,
            isFinishShowResult: false,
            settlementResult: {},
            winningSymbols: [],
            isResultUpdated: false,
            dispose: () => { }
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    onRoundStateChange() {
        this.setState({
            roundState: this.roundTimeStore.roundState
        });
    }

    @render(RoundHistoryStore, (store) => store.histories)
    onResultChange(histories: gc.RoundHistories.RoundHistory[]) {
        if (!histories || histories.length === 0) return;
        const result = histories[0].result as RNGSoccerResult;
        if (!result) return;

        this.setState({
            result,
            isAnimationResult: true,
            isResultUpdated: true
        });

        setTimeout(() => {
            this.setState({
                isAnimationResult: false
            });
        }, POP_UP_ANIMATION_DURATION * 1000);
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    onSettlementResultChange(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) return;
        const { result, settlementResult } = currentFinish;

        if (!result || !settlementResult) return;

        const winningSymbols = Object.entries(settlementResult)
            .filter(([_, value]) => value)
            .map(([key]) => key);

        this.setState({
            result,
            settlementResult,
            winningSymbols
        });
    }

    render() {
        const { result, isAnimationResult, winningSymbols } = this.state;
        const hasResult = Object.keys(result).length > 0;

        return (
            <div className={Styles['container-bets']}>
                <div className={Styles['result-container']}>
                    {hasResult && (
                        <div className={`${Styles['result-item']} ${isAnimationResult ? Styles['pop-in-animation'] : ''}`}>

                        </div>
                    )}
                </div>
            </div>
        );
    }
} 