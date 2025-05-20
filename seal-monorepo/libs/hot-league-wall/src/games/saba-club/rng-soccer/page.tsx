import { Suspense } from 'react';
import * as gc from '@sg/sg-game-client';
import { handle, observer, render } from '@sg/sg-observer';
import { GatewayGameBase } from '../../../games/game-base';
import { IGatewayGameBaseState } from '../../../games/game-base/interfaces/gateway-types';
import { configGameContainer } from '../../../games/game-base/startup';
import type { GameBaseProps } from '../../../games/game-base/type';
import { GameBettingOptionsContext } from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import styles from './rng-soccer.module.scss';
import { containerOptions, setting } from './game-settings';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds/round-time-store';
import RNGSoccerBetOptions from './bet-option/rng-soccer-bet-options';
import liveIcon from '../../../assets/rng-soccer/live-icon.svg';
import bxhIcon from '../../../assets/rng-soccer/bxh.svg';
import bgGame from '../../../assets/rng-soccer/bg-game.webp';
import { RoundId } from '../../../_shared/components/round-id';
import CountDownTimer from '../../../_shared/components/count-down-timer';
import RNGSoccerSettlementResult from './settlement-result/rng-soccer-settlement-result';
import RNGSoccerStatistic from './statistic/rng-soccer-statistic';

/**
 * Game-specific state interface that extends the gateway game base state
 */
interface IRNGSoccerPageState extends IGatewayGameBaseState {
    homeScore: number;
    awayScore: number;
    roundNumber: string;
    isTimerActive: boolean;
    isHeaderExpanded: boolean;
    isBettingDisabled: boolean;
    isPopupVisible: boolean;
}

@observer(setting.mainObserverNamespace)
export default class RNGSoccerPage extends GatewayGameBase<GameBaseProps, IRNGSoccerPageState> {
    override overrideClasses = {
        gameContainer: styles['sport-item'],
        header: styles['wrapper-sport-top'],
        content: styles['wrapper-sport-content'],
        footer: styles['wrapper-sport-bottom'],
        popup: styles['statistic-popup']
    };

    constructor(props: GameBaseProps) {
        super(props);

        this.state = {
            ...this.state,
            gameId: setting.id,
            isHeaderExpanded: true,
            homeScore: 0,
            awayScore: 0,
            roundNumber: '#37699',
            isTimerActive: true,
            isPopupVisible: false,
            roundId: 0,
            isBettingDisabled: false
        } as IRNGSoccerPageState;

        try {
            configGameContainer(setting.name, containerOptions);
        } catch (error) {
            // Silent fail on initialization error
        }
    }

    togglePopup = () => {
        this.setState({
            isPopupVisible: !this.state.isPopupVisible
        });
    }

    setShowBetPanel = (show: boolean) => {
        this.setState({ showBetPanel: show });
    };

    setPanelId = (id: string) => {
        this.setState({ activePanelId: id });
    };

    @handle(gc.Connection.ConnectionHandlers.CloseConnectHandler, (handler) => handler.handleGateway())
    override closeConnect() { }

    override async showResult(hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ): Promise<void> {
        if (!result) return;

        // Update the previous winning bet based on the settlement result
        if (settlementResult && this.state.roundState == ROUND_STATE.LOCKING_BET) {
            // Calculate and update state as needed for game-specific logic
        }
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
                    onBet={() => {
                        // Implement the bet option handler using round handler
                        this.resetBettingPanel();
                        this.setState({ isShowNextRoundMessage: true } as Pick<IRNGSoccerPageState, keyof IRNGSoccerPageState>);
                        setTimeout(() => {
                            this.setState({ isShowNextRoundMessage: false } as Pick<IRNGSoccerPageState, keyof IRNGSoccerPageState>);
                        }, 3000);
                    }}
                />
            </GameBettingOptionsContext.Provider>
        );
    }

    renderStatistic() {
        return (
            <Suspense>
                <RNGSoccerStatistic
                    namespace={this.props.namespace}
                    language={this.props.language}
                    isPopupVisible={this.state.isPopupVisible ?? false}
                    togglePopup={this.togglePopup}
                />
            </Suspense>
        );
    }

    // Section-based rendering methods

    renderGameHeaderSection(): JSX.Element {
        return (
            <div className={styles['wrapper-sport-top']}>
                <div className={styles['game-name']}>
                    <div className={styles['game-name-text']}>
                        RNG Soccer
                        <img src={liveIcon} alt="live" className={styles['live-icon']} />
                    </div>
                    <RoundId
                        clientRoundId={this.state.roundId}
                        roundState={this.state.roundState}
                        className={styles['game-name-round']}
                        useGameStyling={true}
                    />
                </div>
                <CountDownTimer
                    namespace={setting.mainObserverNamespace}
                    language={this.props.language}
                    useGameLayout={true}
                    onComplete={() => { }}
                    customStyles={{
                        wrapper: styles['timmer']
                    }}
                />
                <div className={styles['score-board-img']} onClick={this.togglePopup}>
                    <img src={bxhIcon} alt="bxh" />
                </div>
            </div>
        );
    }

    renderGameContentSection(): JSX.Element {
        return (
            <Suspense>
                <RNGSoccerSettlementResult
                    namespace={setting.mainObserverNamespace}
                    language={this.props.language}
                />
            </Suspense>
        );
    }

    renderGameFooterSection(): JSX.Element {
        return (
            <div className={styles['wrapper-sport-bottom']}>
                {this.renderBettingBlock()}
            </div>
        );
    }

    renderGamePopupSection(): JSX.Element {
        return this.renderStatistic();
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setState({ roundState } as any);
    }

    @render(gc.Rounds.RoundStore, (store) => store.clientRoundId)
    renderRoundId(clientRoundId: number) {
        this.setState({ roundId: clientRoundId } as any);
    }

    // Implementation for the abstract method in GameBase
    override renderGameLayout(): JSX.Element {
        return (
            <div
                className={styles['sport-item']}
                style={{
                    background: `url(${bgGame}) no-repeat center`,
                    backgroundSize: 'cover'
                }}
            >
                {this.renderGameHeaderSection()}
                {this.renderGameContentSection()}
                {this.renderGameFooterSection()}
                {this.renderGamePopupSection()}
            </div>
        );
    }

} 