import * as gc from '@sg/sg-game-client';
import { render } from '@sg/sg-observer';
import styles from './fish-prawn-crab-scoreboard.module.scss';
import { createRef } from 'react';
import React from 'react';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import { IPropsObserver, IStateObserver, ObserverComponent } from '../../../../_shared/components/observer-component/observer-component';
import { FishPrawnCrabChoices, FishPrawnCrabResult } from '../type';
import ScrollElement from '../../../../_shared/components/scroll-element';
import { FishPrawnCrabBetPercentages } from '../bet-percentages';
import FishPrawnCrabDice, { FishPrawnCrabSymbol } from '../../../../_shared/components/fish-prawn-crab-dice';
import { Size } from '../../../../_shared/constants';
import { resultMapper } from '../fish-prawn-crab-utils';

export interface IFishPrawnCrabResultHistoryState extends IStateObserver {
    rounds: gc.RoundHistories.RoundHistory[];
    roundState: string;
}

type Props = IPropsObserver & {
    gameName?: string;
    language: string;
};

export default class FishPrawnCrabScoreBoard extends ObserverComponent<Props, IFishPrawnCrabResultHistoryState> {
    private scrollDivRef = createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.scrollDivRef = React.createRef();
        console.log('[FPC Scoreboard] Constructor initialized', { props });
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('[FPC Scoreboard] componentDidUpdate', {
            prevRounds: prevState.rounds?.length,
            currentRounds: this.state.rounds?.length,
            roundState: this.state.roundState
        });

        // Scroll to right if items have changed
        if (prevState.rounds !== this.state.rounds) {
            this.scrollToRight();
        }
    }

    scrollToRight = () => {
        console.log('[FPC Scoreboard] Scrolling to right');
        if (this.scrollDivRef.current) {
            this.scrollDivRef.current.scrollLeft = this.scrollDivRef.current.scrollWidth;
        }
    };

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderRoundHistory(rounds: gc.RoundHistories.RoundHistory[]) {
        console.log('[FPC Scoreboard] renderRoundHistory', { roundsCount: rounds?.length });
        this.setState({ rounds });
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderCountDownTimerState(roundState: string) {
        console.log('[FPC Scoreboard] renderCountDownTimerState', { roundState });
        this.setState({ roundState });
    }

    // Map from the result value to CSS class names
    private symbolValueToClassMap: Record<number, string> = {
        [resultMapper.fish]: 'symbol-fish',
        [resultMapper.prawn]: 'symbol-prawn',
        [resultMapper.crab]: 'symbol-crab',
        [resultMapper.rooster]: 'symbol-chicken',
        [resultMapper.gourd]: 'symbol-calabash',
        [resultMapper.stag]: 'symbol-coin'
    };

    getSymbolClass(symbol: string): string {
        // Use resultMapper to get the numeric value from the choice
        const symbolValue = resultMapper[symbol as keyof typeof resultMapper];

        // Get the corresponding CSS class from the map
        return this.symbolValueToClassMap[symbolValue] || 'symbol-blink';
    }

    renderDice(result: FishPrawnCrabResult | null, hasBlink: boolean = false): React.ReactNode {
        console.log('[FPC Scoreboard] renderDice', { result, hasBlink });
        if (!result) {
            return (
                <div className={styles['dice-column']}>
                    {hasBlink && (
                        <>
                            <div className={styles['symbol-blink']}></div>
                            <div className={styles['symbol-blink']}></div>
                            <div className={styles['symbol-blink']}></div>
                        </>
                    )}
                </div>
            );
        }

        // Get dice values from the result
        const resultAny = result as any;
        const diceValues: FishPrawnCrabSymbol[] = [];

        if (resultAny.dice1 !== undefined) diceValues.push(resultAny.dice1);
        if (resultAny.dice2 !== undefined) diceValues.push(resultAny.dice2);
        if (resultAny.dice3 !== undefined) diceValues.push(resultAny.dice3);

        console.log('[FPC Scoreboard] Final dice values', { diceValues });

        return (
            <div className={styles['dice-column']}>
                {diceValues.map((symbol, index) => (
                    <FishPrawnCrabDice
                        key={index}
                        symbol={symbol}
                        size={Size.large}
                    />
                ))}
            </div>
        );
    }

    render() {
        const { rounds, roundState } = this.state;
        console.log('[FPC Scoreboard] render', {
            roundsCount: rounds?.length,
            roundState,
            hasBlink: roundState === ROUND_STATE.LOCKING_BET || roundState === ROUND_STATE.SHOW_ANIMATION_RESULT
        });

        if (!rounds || rounds.length === 0) {
            return <></>;
        }

        const hasBlink = roundState === ROUND_STATE.LOCKING_BET || roundState === ROUND_STATE.SHOW_ANIMATION_RESULT;
        const scoreboardText = gc.Translator.translate('Common.scoreboard');

        return (
            <div className={styles['scoreboard']}>
                <div className={styles['scoreboard-title']}>{scoreboardText}</div>
                {
                    <FishPrawnCrabBetPercentages
                        gameName={this.props.gameName || ''}
                        rounds={rounds}
                        language={this.props.language}
                    />
                }
                <ScrollElement className={styles['scoreboard-content']} refData={this.scrollDivRef}>
                    <div className={styles['scoreboard-dice-container']}>
                        {rounds.reverse().map((round, index) => (
                            <div key={round.roundId} className={styles['dice-result']}>
                                {this.renderDice(round.result as unknown as FishPrawnCrabResult, hasBlink && index === 0)}
                            </div>
                        ))}
                        {hasBlink && rounds.length === 0 && (
                            <div className={styles['dice-result']}>
                                {this.renderDice(null, true)}
                            </div>
                        )}
                    </div>
                </ScrollElement>
            </div>
        );
    }
} 