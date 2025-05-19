import React, { Suspense } from 'react';
import * as gc from '@sg/sg-game-client';
import { handle, observer, render } from '@sg/sg-observer';
import GatewayGameBase, { IGatewayGameBaseState } from '../../../_shared/components/game-base/gateway-gamebase';
import { configGameContainer } from '../../../_shared/components/game-base/startup';
import type { GameBaseProps } from '../../../_shared/components/game-base/type';
import { GameBettingOptionsContext } from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import { FunctionUtils } from '../../../_shared/utils/funtion-utils';
import styles from './rng-soccer.module.scss';
import { containerOptions, setting } from './game-settings';
import { ANIMATION_DURATION_MS } from './constants/rng-soccer-constants';
import RNGSoccerBetOptions from './bet-option/rng-soccer-bet-options';
import { RNGSoccerResult, RNGSoccerSettlementResult as RNGSoccerSettlementResultType } from './type';
import liveIcon from '../../../assets/rng-soccer/live-icon.svg';
import bxhIcon from '../../../assets/rng-soccer/bxh.svg';
import homeDefaultLogo from '../../../assets/rng-soccer/home-default-logo.svg';
import awayDefaultLogo from '../../../assets/rng-soccer/away-default-logo.svg';
import cardBack from '../../../assets/rng-soccer/cards/card-back.svg';
import closeIcon from '../../../assets/rng-soccer/close.svg';
import bgGame from '../../../assets/rng-soccer/bg-game.webp';
import RNGSoccerCountDownTimer from './components/rng-soccer-countdown-timer';
import { RngSoccerRoundId } from './components/rng-soccer-round-id';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds/round-time-store';
import RNGSoccerSettlementResult from './settlement-result/rng-soccer-settlement-result';

interface IRNGSoccerPageState extends IGatewayGameBaseState {
    activePanelId: any;
    roundState: string;
    showBetPanel: boolean;
    gameId: number;
    homeScore: number;
    awayScore: number;
    roundNumber: string;
    isTimerActive: boolean;
    isPopupVisible: boolean;
    roundId: number;
}

@observer(setting.mainObserverNamespace)
export default class RNGSoccerPage extends GatewayGameBase<GameBaseProps, IRNGSoccerPageState> {
    override overrideClasses = {
        blockWrapper: styles['block-wrapper'],
        betOptions: styles['bet-options-block'],
        info: styles['info-block'],
        result: styles['result-block'],
    };

    state = {
        ...this.state,
        gameId: setting.id,
        isHeaderExpanded: true,
        homeScore: 0,
        awayScore: 0,
        roundNumber: '#37699',
        isTimerActive: true,
        isPopupVisible: false,
        roundId: 0
    };

    constructor(props: GameBaseProps) {
        super(props);
        try {
            configGameContainer(setting.name, containerOptions);
        } catch (error) {
            // Silent fail on initialization error
        }
    }

    toggleHeader = () => {
        // this.setState({
        //     ...this.state,
        //     isHeaderExpanded: !this.state.isHeaderExpanded
        // });
    }

    togglePopup = () => {
        this.setState({
            ...this.state,
            isPopupVisible: !this.state.isPopupVisible
        });
    }

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handleGateway())
    closeConnect() { }

    async showResult(hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ) {
        if (!result) return;

        // Update the previous winning bet based on the settlement result
        if (settlementResult && this.state.roundState == ROUND_STATE.LOCKING_BET) {
            // const winningBet = Object.entries(settlementResult).find(([_, value]) => Number(value) > 0)?.[0] as IBaccaratBet['type'];
            // this.setState({ previousWinningBet: winningBet });
        }
    }

    renderRoundHistory() {
        return (
            <Suspense>
                {/* <RNGSoccerRoundHistory namespace={this.props.namespace} language={this.props.language} /> */}
            </Suspense>
        );
    }

    renderBettingBlock() {
        return (
            <GameBettingOptionsContext.Provider
                value={{
                    panelId: this.state.activePanelId,
                    setPanelId: this.setPanelId,
                    show: this.state.showBetPanel,
                    setShow: this.setShowBetPanel,
                }}
            >
                <RNGSoccerBetOptions
                    gameName={setting.gameName}
                    namespace={setting.mainObserverNamespace}
                    language={this.props.language}
                    onBet={this.handleBetOption}
                />
            </GameBettingOptionsContext.Provider>
        );
    }

    renderSettlementResult() {
        return (
            <Suspense>
                <RNGSoccerSettlementResult
                    namespace={setting.mainObserverNamespace}
                    language={this.props.language}
                />
            </Suspense>
        );
    }

    renderStatistic() {
        return (
            <Suspense>
                {/* <RNGSoccerStatistic namespace={this.props.namespace} language={this.props.language} /> */}
            </Suspense>
        );
    }

    renderGameHeader(): JSX.Element {
        return (
            <div className={styles['wrapper-sport-top']}>
                <div className={styles['game-name']}>
                    <div className={styles['game-name-text']}>
                        RNG Soccer
                        <img src={liveIcon} alt="live" className={styles['live-icon']} />
                    </div>
                    <RngSoccerRoundId
                        roundNumber={this.state.roundId}
                        roundState={this.state.roundState}
                    />
                </div>
                <RNGSoccerCountDownTimer
                    namespace={setting.mainObserverNamespace}
                    language={this.props.language}
                    onComplete={() => {
                        // Handle timer completion if needed
                        this.setState({ isTimerActive: false });
                    }}
                />
                <div className={styles['score-board-img']} onClick={this.togglePopup}>
                    <img src={bxhIcon} alt="bxh" />
                </div>
            </div>
        );
    }

    renderGameContent(): JSX.Element {
        return (
            <div className={styles['wrapper-sport-middle']}>
                <div className={`${styles['sport-team']} ${styles['home-team']}`}>
                    <div className={styles['sport-team-img']}>
                        <img src={homeDefaultLogo} alt="home-team" />
                    </div>
                    <div className={styles['sport-team-name']}>Man.city</div>
                </div>
                <div className={styles['sport-result']}>
                    <div className={styles['container-result']}>
                        <div className={styles['card-section']}>
                            <img src={cardBack} alt="card" />
                        </div>
                        {this.renderSettlementResult()}
                        <div className={styles['card-section']}>
                            <img src={cardBack} alt="card" />
                        </div>
                    </div>
                </div>
                <div className={`${styles['sport-team']} ${styles['away-team']}`}>
                    <div className={styles['sport-team-img']}>
                        <img src={awayDefaultLogo} alt="away-team" />
                    </div>
                    <div className={styles['sport-team-name']}>Arsenal</div>
                </div>
            </div>
        );
    }

    renderGameFooter(): JSX.Element {
        return (
            <div className={styles['wrapper-sport-bottom']}>
                {this.renderBettingBlock()}
            </div>
        );
    }

    renderGamePopup(): JSX.Element {
        return (
            <div className={`${styles['wrapper-popup']} ${this.state.isPopupVisible ? styles['active'] : ''}`}>
                <div className={styles['history-block']}>
                    <div className={styles['history-block-item']}>
                        <span>Home</span>
                        <span>43%</span>
                    </div>
                    <div className={styles['history-block-item']}>
                        <span>Draw</span>
                        <span>10%</span>
                    </div>
                    <div className={styles['history-block-item']}>
                        <span>Away</span>
                        <span>43%</span>
                    </div>
                </div>
                <div className={styles['close-popup']} onClick={this.togglePopup}>
                    <img src={closeIcon} alt="close" className={styles['close-icon']} />
                </div>
            </div>
        );
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setState({ roundState });
    }

    render() {
        return (
            <div
                className={styles['sport-item']}
                style={{
                    background: `url(${bgGame}) no-repeat center`,
                    backgroundSize: 'cover'
                }}
            >
                {this.renderGameHeader()}
                {this.renderGameContent()}
                {this.renderGameFooter()}
                {this.renderGamePopup()}
            </div>
        );
    }
} 