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
import { DEMO_RESULTS } from "./constants/demo-results";
import { gameStateService } from "./services/game-state.service";
import Styles from "./animations/baccarat-animations.module.scss";

interface IBaccaratSettlementResultState extends IStateObserver {
    result?: Result;
    roundState: string;
    isAnimationResult: boolean;
    isResultVisible: boolean;
    isLoading: boolean;
    error?: Error;
    isAutoSwitchEnabled: boolean;
    currentDemoIndex: number;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratSettlementResult extends ObserverComponent<IPropsObserver, IBaccaratSettlementResultState> {
    private readonly texts = {
        player: gc.Translator.t(TRANSLATIONS.PLAYER),
        banker: gc.Translator.t(TRANSLATIONS.BANKER),
    };
    private autoSwitchTimer: NodeJS.Timeout | null = null;

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
            isAutoSwitchEnabled: true,
            currentDemoIndex: 0,
        };
    }

    componentWillUnmount(): void {
        this.clearAutoSwitchTimer();
    }

    private clearAutoSwitchTimer(): void {
        if (this.autoSwitchTimer) {
            clearTimeout(this.autoSwitchTimer);
            this.autoSwitchTimer = null;
        }
    }

    private startAutoSwitchTimer(): void {
        this.clearAutoSwitchTimer();
        if (this.state.isAutoSwitchEnabled) {
            this.autoSwitchTimer = setTimeout(() => {
                this.toggleResultVisibility();
                // After hiding the current result, move to the next demo
                if (!this.state.isResultVisible) {
                    this.setState(prevState => ({
                        currentDemoIndex: (prevState.currentDemoIndex + 1) % DEMO_RESULTS.length,
                        isAnimationResult: true
                    }));
                }
                this.startAutoSwitchTimer();
            }, 5000);
        }
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
                this.setState({ result, isAnimationResult: true, isLoading: false }, () => {
                    this.startAutoSwitchTimer();
                });
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
                this.setState({ result, isLoading: false }, () => {
                    this.startAutoSwitchTimer();
                });
            }
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    private toggleResultVisibility = (): void => {
        this.setState((prevState) => ({ isResultVisible: !prevState.isResultVisible }));
    };

    private toggleAutoSwitch = (): void => {
        this.setState(
            prevState => ({ isAutoSwitchEnabled: !prevState.isAutoSwitchEnabled }),
            () => {
                if (this.state.isAutoSwitchEnabled) {
                    this.startAutoSwitchTimer();
                } else {
                    this.clearAutoSwitchTimer();
                }
            }
        );
    };

    private renderToggleButton(): JSX.Element {
        const { isResultVisible, isAutoSwitchEnabled } = this.state;
        return (
            <div className={Styles['button-container']}>
                <button
                    onClick={this.toggleResultVisibility}
                    className={Styles['toggle-button']}
                >
                    {isResultVisible ? BUTTON_LABELS.HIDE : BUTTON_LABELS.SHOW}
                </button>
                <button
                    onClick={this.toggleAutoSwitch}
                    className={`${Styles['toggle-button']} ${Styles['auto-switch-button']}`}
                >
                    {isAutoSwitchEnabled ? 'Stop Auto Switch' : 'Start Auto Switch'}
                </button>
            </div>
        );
    }

    private renderCardDisplay(): JSX.Element | null {
        const { result, isAnimationResult, isResultVisible, currentDemoIndex } = this.state;
        if (!result && currentDemoIndex >= DEMO_RESULTS.length) return null;

        return (
            <CardDisplay
                result={DEMO_RESULTS[currentDemoIndex]}
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