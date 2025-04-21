import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render } from "@sg/sg-observer";
import { WinnerDisplay } from "../../../../_shared/components/winner-display/winner-display";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../../_shared/components/observer-component/observer-component";
import { FishPrawnCrabResult, FishPrawnCrabChoices } from "../type";
import Styles from "./fish-prawn-crab-animations.module.scss";
import { gameStateService } from "./services/game-state.service";
import FishPrawnCrabDice, { FishPrawnCrabSymbol, diceValueToSymbol } from "../../../../_shared/components/fish-prawn-crab-dice";
import { Size } from "../../../../_shared/constants";
import { constants } from "../constants";
import { convertValueToSymbol, resultMapper } from "../fish-prawn-crab-utils";
import { AnimatedDiceSet } from '../../../../_shared/components/fish-prawn-crab-dice/animated-dice';

// Define default result to show when no actual result is available
const DEFAULT_RESULT = {};

export interface IFishPrawnCrabSettlementResultState extends IStateObserver {
    result: gc.GameServiceMessage.TResult;
    roundState: string;
    isAnimationResult: boolean;
    win: number;
    isFinishShowResult: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
    winningSymbols: string[];
    isResultUpdated: boolean;
    isAnimationComplete: boolean;
}

export default class FishPrawnCrabSettlementResult extends ObserverComponent<IPropsObserver, IFishPrawnCrabSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            result: DEFAULT_RESULT,
            roundState: '',
            isAnimationResult: false,
            win: 0,
            isFinishShowResult: false,
            settlementResult: {},
            winningSymbols: [],
            isResultUpdated: false,
            isAnimationComplete: false,
        };
        console.log('[FPC Settlement] Component initialized with props:', props);
    }

    @render(RoundTimeStore, (store) => store.roundState)
    private handleRoundState(roundState: string) {
        console.log('[FPC Settlement] Round state changed:', roundState);
        if (roundState === ROUND_STATE.STARTING_ROUND || roundState === ROUND_STATE.PLACING_BET) {
            console.log('[FPC Settlement] Resetting state due to new round');
            this.setState({
                isFinishShowResult: false,
                result: DEFAULT_RESULT,
                settlementResult: {},
                winningSymbols: [],
                isResultUpdated: false,
                isAnimationResult: false,
                isAnimationComplete: false
            });
        }

        if (roundState === ROUND_STATE.SHOW_RESULT) {
            console.log('[FPC Settlement] Setting isResultUpdated to true');
            this.setState({ isResultUpdated: true });
        }

        if (roundState === ROUND_STATE.SHOW_ANIMATION_RESULT) {
            // When animation result begins, reset animation state
            this.setState({
                roundState,
                isAnimationResult: true,
                isAnimationComplete: false
            });
        }

        this.setState({ roundState });
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    private renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        console.log('[FPC Settlement] Current finish received:', currentFinish);
        if (!currentFinish) {
            console.log('[FPC Settlement] No current finish data available');
            return;
        }
        const { result, settlementResult } = currentFinish;

        if (!result || !settlementResult) {
            console.log('[FPC Settlement] Missing result or settlementResult in currentFinish');
            return;
        }

        const winningSymbols = this.getWinningSymbols(settlementResult);
        console.log('[FPC Settlement] Winning symbols:', winningSymbols);
        this.setState({
            result,
            isAnimationResult: true,
            isFinishShowResult: false,
            settlementResult,
            winningSymbols,
            isResultUpdated: true
        });
    }

    private getWinningSymbols(settlementResult: gc.GameServiceMessage.TSettlementResult): string[] {
        const winningSymbols: string[] = [];

        Object.entries(settlementResult).forEach(([key, value]) => {
            if (value) {
                winningSymbols.push(key);
            }
        });

        console.log('[FPC Settlement] Extracted winning symbols:', winningSymbols);
        return winningSymbols;
    }

    @render(RoundHistoryStore, (store) => store.firstJoinGameHistory)
    private handleJoinGameAndShowResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        console.log('[FPC Settlement] First join game history:', firstJoinGameHistory);
        const { roundState } = this.state;

        if (roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET) {
            console.log('[FPC Settlement] Skipping history processing during betting phase');
            return;
        }

        if (!firstJoinGameHistory) {
            console.log('[FPC Settlement] No game history available');
            return;
        }

        const result = gameStateService.handleGameHistory(firstJoinGameHistory);
        console.log('[FPC Settlement] Game history result:', result);
        if (result && gameStateService.validateResult(result as FishPrawnCrabResult)) {
            console.log('[FPC Settlement] Valid result from game history');
            this.setState({
                result,
                isFinishShowResult: true,
                isResultUpdated: true
            });
        }
        const lastRound = firstJoinGameHistory?.roundHistory;
        if (lastRound) {
            console.log('[FPC Settlement] Processing last round history:', lastRound);
            const winningSymbols = this.getWinningSymbols(lastRound?.settlementResult);
            this.setState({
                result: lastRound?.result,
                settlementResult: lastRound?.settlementResult,
                winningSymbols,
                isResultUpdated: true
            });
        }
    }

    @render(gc.Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    finishShowResult(isFinishedShowResult: boolean) {
        console.log('[FPC Settlement] Finished show result:', isFinishedShowResult);
        this.setState({ isFinishShowResult: isFinishedShowResult });
    }

    @render(gc.Settlements.SettlementStatusStore, (store) => store.settlementStatus, {
        fireImmediately: false,
    })
    assignStatus(settlementStatus: any) {
        console.log('[FPC Settlement] Settlement status received:', settlementStatus);
        this.setState({ win: settlementStatus.bet });
    }

    renderWinnerDisplay = () => {
        const { settlementResult, isFinishShowResult, winningSymbols } = this.state;
        const t = (key) => gc.Translator.t(key, { lng: this.props.language || '' });

        console.log('[FPC Settlement] Rendering winner display. isFinishShowResult:', isFinishShowResult, 'winningSymbols:', winningSymbols);

        if (!isFinishShowResult || !settlementResult || Object.keys(settlementResult).length === 0) {
            console.log('[FPC Settlement] Cannot render winner display - missing data');
            return null;
        }

        let result = '';

        Object.entries(settlementResult).forEach(([key, value]) => {
            if (value) {
                result = t(`FishPrawnCrab.${key}_win`);
            }
        });

        console.log('[FPC Settlement] Winner display result text:', result);
        return <WinnerDisplay resultText={result} className={Styles['fish-prawn-crab-result']} />;
    };

    isWinningSymbol = (symbol: string | number): boolean => {
        console.log('[FPC Settlement] DEBUG - Symbol input type:', typeof symbol, 'value:', symbol, 'winningSymbols:', this.state.winningSymbols);

        // First try direct match with the winning symbols array
        if (typeof symbol === 'string' && this.state.winningSymbols.includes(symbol)) {
            console.log('[FPC Settlement] Symbol matched directly:', symbol);
            return true;
        }

        // Direct mapping from enum values to string names that match the winningSymbols array
        const enumToStringMap = {
            [FishPrawnCrabSymbol.STAG]: 'stag',
            [FishPrawnCrabSymbol.GOURD]: 'gourd',
            [FishPrawnCrabSymbol.ROOSTER]: 'rooster',
            [FishPrawnCrabSymbol.FISH]: 'fish',
            [FishPrawnCrabSymbol.CRAB]: 'crab',
            [FishPrawnCrabSymbol.PRAWN]: 'prawn',
        };

        // Get the string representation for comparison
        const stringSymbol = enumToStringMap[symbol as number];
        console.log('[FPC Settlement] Mapped symbol:', symbol, 'to string:', stringSymbol);

        const isWinning = stringSymbol && this.state.winningSymbols.includes(stringSymbol);
        console.log('[FPC Settlement] Final result - Symbol:', symbol, 'is winning:', isWinning);

        return isWinning;
    };

    renderIcons = (result: gc.GameServiceMessage.TResult) => {
        const { isAnimationResult, isAnimationComplete } = this.state;
        console.log('[FPC Settlement] Rendering icons with result:', result, 'isAnimationResult:', isAnimationResult);

        // Convert result to array of symbols for the animated dice
        const resultSymbols = Object.entries(result).map(([key, value]) => {
            return convertValueToSymbol(value);
        });

        // Handle animation completion
        const handleAnimationComplete = () => {
            this.setState({ isAnimationComplete: true });
        };

        return (
            <div className={`${Styles['container-bets']} ${Styles['has-animation']} ${isAnimationResult ? Styles['has-animation'] : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={Styles['result-container']} style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>

                    <AnimatedDiceSet
                        finalSymbols={resultSymbols}
                        size={Size.large}
                        animationDuration={3000}
                        onAllAnimationsComplete={handleAnimationComplete}
                        staggerDelay={150}
                    />
                    {/* {isAnimationResult && !isAnimationComplete ? (
                        <AnimatedDiceSet
                            finalSymbols={resultSymbols}
                            size={Size.large}
                            animationDuration={3000}
                            onAllAnimationsComplete={handleAnimationComplete}
                            staggerDelay={150}
                        />
                    ) : (
                        Object.entries(result).map(([key, value], index) => {
                            // Get the symbol directly from the value
                            const symbol = convertValueToSymbol(value);
                            // Pass the numeric value to isWinningSymbol
                            const isWinning = this.isWinningSymbol(value);

                            console.log('[FPC Settlement] Rendering dice:', key, value, 'symbol:', symbol, 'isWinning:', isWinning);

                            return (
                                <div
                                    className={`${Styles['result-item']} ${isWinning ? Styles['winning-symbol'] : ''}`}
                                    key={index}
                                >
                                    <FishPrawnCrabDice
                                        symbol={symbol}
                                        size={Size.large}
                                    />
                                </div>
                            );
                        })
                    )} */}
                </div>
                {this.renderWinnerDisplay()}
            </div>
        );
    };

    renderNoResultIcons = (): JSX.Element => {
        console.log('[FPC Settlement] Rendering empty dice (no result)');
        return (
            <div className={Styles['result-container']} style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
                {[0, 1, 2].map((index) => (
                    <div
                        className={Styles['result-item']}
                        key={index}
                        style={{
                            position: 'relative',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '5px',
                            backgroundColor: '#fff',
                            boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                            transform: 'scale(1)',
                            opacity: 1,
                            margin: '0 5px',
                            width: 'auto',
                            height: 'auto',
                            minWidth: '60px',
                            minHeight: '60px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 5
                        }}
                    >
                        <FishPrawnCrabDice symbol={FishPrawnCrabSymbol.EMPTY} size={Size.large} />
                    </div>
                ))}
            </div>
        );
    };

    render() {
        const isEmpty = (obj: object): boolean => {
            return JSON.stringify(obj) === '{}';
        };

        const { result, roundState, isResultUpdated } = this.state;
        console.log('[FPC Settlement] Render called with state:', {
            resultEmpty: isEmpty(result as object),
            roundState,
            isResultUpdated
        });

        if (!result || isEmpty(result as object) || roundState === ROUND_STATE.PLACING_BET || roundState === ROUND_STATE.LOCKING_BET || !isResultUpdated) {
            console.log('[FPC Settlement] Rendering empty state');
            return this.renderNoResultIcons();
        }

        console.log('[FPC Settlement] Rendering settlement result');
        return (
            <div className={Styles.settlementContainer} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: '500px', width: '100%' }}>{this.renderIcons(result)}</div>
            </div>
        );
    }
} 