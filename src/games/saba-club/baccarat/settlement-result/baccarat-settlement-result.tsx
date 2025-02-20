import * as gc from "@sg/sg-game-client";
import React from "react";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render } from "@sg/sg-observer";
import { observer } from '@sg/sg-observer';
import type { Result } from "../baccarat";
import { CardDisplay } from "./components/card-display";
import { ErrorBoundary } from "./components/error-boundary";
import { Loading } from "./components/loading";
import type { IPropsObserver, IStateObserver } from "../../../../_shared/components/observer-component/observer-component";
import { ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { setting } from "../game-settings";
import { BUTTON_LABELS, TRANSLATIONS } from "./constants";
import { gameStateService } from "./services/game-state.service";
import Styles from "./animations/baccarat-animations.module.scss";

interface IBaccaratSettlementResultState extends IStateObserver {
    result?: Result;
    roundState: string;
    isAnimationResult: boolean;
    isResultVisible: boolean;
    isLoading: boolean;
    error?: Error;
}

const DEMO_RESULT = {
    banker: { card1: { card: 1, type: 0 }, card2: { card: 5, type: 2 }, card3: { card: 7, type: 2 } },
    player: { card1: { card: 8, type: 3 }, card2: { card: 5, type: 3 }, card3: { card: 8, type: 1 } },
} as const;

@observer(setting.mainObserverNamespace)
export default class BaccaratSettlementResult extends ObserverComponent<IPropsObserver, IBaccaratSettlementResultState> {
    private readonly texts = {
        player: gc.Translator.t(TRANSLATIONS.PLAYER),
        banker: gc.Translator.t(TRANSLATIONS.BANKER),
    };

    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: undefined,
            roundState: "",
            isAnimationResult: false,
            isResultVisible: false,
            isLoading: true,
            error: undefined,
        };
    }

    @render(RoundTimeStore, (store) => store.roundState)
    private handleRoundState(roundState: string): void {
        try {
            gameStateService.handleRoundState(roundState);
            this.setState({ roundState, isLoading: false });
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    private handleCurrentFinish(currentFinish: gc.GameServiceMessage.Finish): void {
        try {
            const result = gameStateService.handleSettlement(currentFinish);
            if (result && gameStateService.validateResult(result)) {
                this.setState({ result, isAnimationResult: true, isLoading: false });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    private handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory): void {
        try {
            const result = gameStateService.handleGameHistory(firstJoinGameHistory);
            if (result && gameStateService.validateResult(result)) {
                this.setState({ result, isLoading: false });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    private toggleResultVisibility = (): void => {
        this.setState((prevState) => ({ isResultVisible: !prevState.isResultVisible }));
    };

    private renderToggleButton(): JSX.Element {
        const { isResultVisible } = this.state;
        return (
            <button
                onClick={this.toggleResultVisibility}
                className={Styles['toggle-button']}
            >
                {isResultVisible ? BUTTON_LABELS.HIDE : BUTTON_LABELS.SHOW}
            </button>
        );
    }

    private renderCardDisplay(): JSX.Element | null {
        const { result, isAnimationResult, isResultVisible } = this.state;
        if (!result) return null;

        return (
            <CardDisplay
                result={DEMO_RESULT}
                isAnimationResult={isAnimationResult}
                isShowResult={isResultVisible}
                texts={this.texts}
            />
        );
    }

    private renderContent(): JSX.Element {
        const { isLoading, error } = this.state;

        if (error) {
            throw error;
        }

        if (isLoading) {
            return <Loading message="Loading game results..." />;
        }

        return (
            <div className={Styles['settlement-container']}>
                {this.renderToggleButton()}
                {this.renderCardDisplay()}
            </div>
        );
    }

    render(): JSX.Element {
        return (
            <ErrorBoundary>
                {this.renderContent()}
            </ErrorBoundary>
        );
    }
} 