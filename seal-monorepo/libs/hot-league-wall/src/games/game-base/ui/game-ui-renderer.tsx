import * as gc from '@sg/sg-game-client';
import React from 'react';
import classNames from 'classnames';
import AnimationBalance from '../../../_shared/components/anim-balance';
import { ConfirmBet } from '../../../_shared/components/bet-option/confirm-bet';
import Notice from '../../../_shared/components/notices/notice';
import Warning from '../../../_shared/components/notices/warning';
import WarningDialog from '../../../_shared/components/notices/warning-dialog';
import { RoundId } from '../../../_shared/components/round-id';
import CountDownTimer from '../../../_shared/components/count-down-timer';
import Styles from '../game-base.module.scss';
import { IGameBaseState } from '../interfaces';
import { GameBaseProps } from '../type';

/**
 * GameUIRenderer - Handles UI rendering functionality for GameBase
 */
export class GameUIRenderer<P extends GameBaseProps, S extends IGameBaseState> {
    // -------------------------------------------------------------------------
    // UI COMPONENTS - Render methods for UI sections
    // -------------------------------------------------------------------------

    renderNotice(props: P, state: S): JSX.Element {
        return (
            <Notice
                namespace={props.namespace}
                isDisableGame={state.showDisabledPopup}
                language={props.language}
            />
        );
    }

    renderWarning(props: P): JSX.Element {
        return <Warning namespace={props.namespace} />;
    }

    renderRoundIdSection(state: S) {
        const { roundId, roundState } = state;
        return <RoundId clientRoundId={roundId} roundState={roundState} />;
    }

    renderCountDownTimer(props: P, setState: (state: Partial<S>) => void) {
        return (
            <CountDownTimer
                namespace={props.namespace}
                onComplete={() => {
                    setState({ isAllowedBet: true } as Partial<S>);
                }}
            />
        );
    }

    renderResultBlock(): JSX.Element {
        return <></>;
    }

    renderStatistic(): JSX.Element {
        return <>Statistic</>;
    }

    renderWaitingForNextRound(state: S) {
        if (!state.isShowNextRoundMessage) {
            return <></>;
        }
        return (
            <WarningDialog key={`warning-bet`}>
                <div className={Styles['title-white']}>{gc.Translator.t('Common.message_placebet_next_round')}</div>
            </WarningDialog>
        );
    }

    renderBettingBlock(): JSX.Element {
        return <></>;
    }

    renderAnimationBalance(state: S) {
        const { statusSettlement, isFinishShowResult } = state;

        if (!statusSettlement || !statusSettlement.win) {
            return <></>;
        }

        if (isFinishShowResult) {
            return <AnimationBalance winBet={statusSettlement?.bet} />;
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // New section-based rendering methods
    // -------------------------------------------------------------------------

    /**
     * Renders the game header section with customizable UI elements
     * @param props Game properties
     * @param state Game state
     * @param setState Callback to update state
     * @param overrideClasses Optional CSS class overrides
     * @returns JSX.Element for the game header
     */
    renderGameHeaderSection(props: P, state: S, setState: (state: Partial<S>) => void, overrideClasses?: any): JSX.Element {
        // Default implementation - can be overridden by game-specific classes
        return (
            <div className={`${Styles['game-header']} ${overrideClasses?.header}`}>
                <div className={Styles['game-name']}>
                    {state.gameId && <div className={Styles['game-name-text']}>{state.gameId}</div>}
                    {this.renderRoundIdSection(state)}
                </div>
                {this.renderCountDownTimer(props, setState)}
            </div>
        );
    }

    /**
     * Renders the game content section with game-specific UI elements
     * @param props Game properties
     * @param state Game state
     * @param overrideClasses Optional CSS class overrides
     * @returns JSX.Element for the game content area
     */
    renderGameContentSection(props: P, state: S, overrideClasses?: any): JSX.Element {
        // Default implementation - can be overridden by game-specific classes
        return (
            <div className={`${Styles['game-content']} ${overrideClasses?.content}`}>
                {this.renderResultBlock()}
            </div>
        );
    }

    /**
     * Renders the game footer section with betting options and controls
     * @param props Game properties
     * @param state Game state
     * @param overrideClasses Optional CSS class overrides
     * @returns JSX.Element for the game footer
     */
    renderGameFooterSection(props: P, state: S, overrideClasses?: any): JSX.Element {
        // Default implementation - can be overridden by game-specific classes
        return (
            <div className={`${Styles['game-footer']} ${overrideClasses?.footer}`}>
                <div
                    className={classNames(
                        Styles['bet-options'],
                        {
                            [Styles['disabled']]: !state.isAllowedBet,
                        },
                        overrideClasses?.betOptions,
                    )}
                >
                    {this.renderBettingBlock()}
                    <ConfirmBet namespace={props.namespace} />
                    <div className={`${Styles['animation-balance']} ${Styles[`game-${state.gameId}`]}`}>
                        {this.renderAnimationBalance(state)}
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Renders the game statistics or popup content
     * @param props Game properties
     * @param state Game state
     * @param toggleStatistic Function to toggle statistics visibility
     * @param overrideClasses Optional CSS class overrides
     * @returns JSX.Element for the game statistic or popup content
     */
    renderGamePopupSection(props: P, state: S, toggleStatistic: () => void, overrideClasses?: any): JSX.Element {
        // Default implementation - can be overridden by game-specific classes
        return (
            <div className={`${Styles['game-popup']} ${overrideClasses?.popup}`}>
                {this.renderStatistic()}
                {this.renderNotice(props, state)}
                {this.renderWarning(props)}
                {this.renderWaitingForNextRound(state)}
            </div>
        );
    }

    // Main layout template
    renderGameLayout(props: P, state: S, setStateCallback: (state: Partial<S>) => void, toggleStatistic: () => void, overrideClasses?: any): JSX.Element {
        // Default implementation that can be overridden by game-specific implementations
        return (
            <div className={`${Styles['game-container']} ${overrideClasses?.gameContainer}`}>
                {this.renderGameHeaderSection(props, state, setStateCallback, overrideClasses)}
                {this.renderGameContentSection(props, state, overrideClasses)}
                {this.renderGameFooterSection(props, state, overrideClasses)}
                {this.renderGamePopupSection(props, state, toggleStatistic, overrideClasses)}
            </div>
        );
    }
}

export default GameUIRenderer; 