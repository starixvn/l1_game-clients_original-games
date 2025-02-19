import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render } from "@sg/sg-observer";
import React from "react";
import { observer } from '@sg/sg-observer';
import type { Result } from "../../baccarat";
import Styles from "./baccarat-animations.module.scss";
import { PlayerBankerResultComponent } from "./player-banker-result";
import { setting } from "../../game-settings";
import type { IPropsObserver, IStateObserver } from "../../../../../_shared/components/observer-component/observer-component";
import { ObserverComponent } from "../../../../../_shared/components/observer-component/observer-component";

const classAnimation = "has-animation";

interface IBaccaratResultState extends IStateObserver {
    result?: Result;
    roundState: string;
    isAnimationResult: boolean;
    isResultVisible: boolean;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratResult extends ObserverComponent<IPropsObserver, IBaccaratResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: undefined,
            roundState: "",
            isAnimationResult: false,
            isResultVisible: false,
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
        const { result } = currentFinish;

        if (!result) {
            return;
        }

        this.setState({ result: result as Result, isAnimationResult: true });
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        const lastRound = firstJoinGameHistory?.roundHistory;
        if (lastRound) {
            this.setState({ result: lastRound?.result as Result });
        }
    }

    toggleResultVisibility = () => {
        this.setState((prevState) => ({ isResultVisible: !prevState.isResultVisible }));
    };

    render() {
        const { result, roundState, isAnimationResult, isResultVisible } = this.state;

        // if (!result || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
        //     return null;
        // }

        const isShowResult = isResultVisible; //&& !(!result || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET);
        let resultTemp = {
            banker: { card1: { card: 1, type: 0 }, card2: { card: 11, type: 2 }, card3: { card: 12, type: 2 } },
            player: { card1: { card: 8, type: 3 }, card2: { card: 5, type: 3 }, card3: { card: 8, type: 1 } },
        };

        const resultCount = 4 + (!!resultTemp.player.card3 ? 1 : 0) + (!!resultTemp.banker.card3 ? 1 : 0);
        const suffix = !resultTemp.player.card3 && !!resultTemp.banker.card3 ? "-banker" : "";
        const classCardCount = `card-${resultCount}${suffix}`;
        const texts = {
            player: gc.Translator.t(`player`),
            banker: gc.Translator.t(`banker`),
        };

        return (
            <div className={`${Styles["open-cards"]} ${Styles[classCardCount]} ${isAnimationResult ? Styles[classAnimation] : ""}`}>
                <button onClick={this.toggleResultVisibility}>
                    {isResultVisible ? "Hide Result" : "Show Result"}
                </button>
                <PlayerBankerResultComponent
                    playResultAnimation={true}
                    result={resultTemp}
                    texts={texts}
                    isShowResult={isShowResult}
                />
            </div>
        );
    }
} 