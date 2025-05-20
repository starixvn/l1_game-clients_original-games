import * as gc from '@sg/sg-game-client';
import React from 'react';
import classNames from 'classnames';
import AnimationBalance from '../../anim-balance';
import { ConfirmBet } from '../../bet-option/confirm-bet';
import Notice from '../../notices/notice';
import Warning from '../../notices/warning';
import StatisticButton from '../../statistic-button/statistic-button';
import WarningDialog from '../../notices/warning-dialog';
import { RoundId } from '../../round-id';
import CountDownTimer from '../../count-down-timer';
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

    renderRoundHistory(): JSX.Element {
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
    // LAYOUT SECTIONS - Methods for rendering main UI structure
    // -------------------------------------------------------------------------

    renderGameHeader(props: P, state: S, setState: (state: Partial<S>) => void, overrideClasses?: any): JSX.Element {
        return (
            <div className={`${Styles['info']} ${overrideClasses?.info}`}>
                {this.renderRoundIdSection(state)}
                {this.renderCountDownTimer(props, setState)}
            </div>
        );
    }

    renderGameContent(overrideClasses?: any): JSX.Element {
        return (
            <div className={`${Styles['result']} ${overrideClasses?.result}`}>
                {this.renderResultBlock()}
            </div>
        );
    }

    renderGameFooter(props: P, state: S, overrideClasses?: any): JSX.Element {
        return (
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
        );
    }

    renderGamePopup(props: P, state: S, toggleStatistic: () => void): JSX.Element {
        return (
            <div className={Styles['history-block']}>
                <div className={Styles['statistic-btn']}>
                    <StatisticButton isOpenStatistic={state.isOpenStatistic} handleToggle={toggleStatistic} />
                </div>
                {this.renderNotice(props, state)}
                {this.renderWarning(props)}
                {this.renderWaitingForNextRound(state)}
                {state.isOpenStatistic && this.renderStatistic()}
            </div>
        );
    }

    // Main layout template
    renderGameLayout(props: P, state: S, setStateCallback: (state: Partial<S>) => void, toggleStatistic: () => void, overrideClasses?: any): JSX.Element {
        return (
            <>
                <div className={`${Styles['block-wrapper']} ${overrideClasses?.blockWrapper}`}>
                    {this.renderGameHeader(props, state, setStateCallback, overrideClasses)}
                    {this.renderGameContent(overrideClasses)}
                    {this.renderGameFooter(props, state, overrideClasses)}
                </div>
                {this.renderGamePopup(props, state, toggleStatistic)}
            </>
        );
    }
}

export default GameUIRenderer; 