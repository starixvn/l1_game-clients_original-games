import { Suspense } from 'react';
import * as gc from '@sg/sg-game-client';
import { handle, observer, render } from '@sg/sg-observer';
import GatewayGameBase, { IGatewayGameBaseState } from '../../../_shared/components/game-base/gateway-gamebase';
import { configGameContainer } from '../../../_shared/components/game-base/startup';
import type { GameBaseProps } from '../../../_shared/components/game-base/type';
import { GameBettingOptionsContext } from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import styles from './rng-soccer.module.scss';
import { containerOptions, setting } from './game-settings';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds/round-time-store';
import RNGSoccerBetOptions from './bet-option/rng-soccer-bet-options';
import liveIcon from '../../../assets/rng-soccer/live-icon.svg';
import bxhIcon from '../../../assets/rng-soccer/bxh.svg';
import bgGame from '../../../assets/rng-soccer/bg-game.webp';
import RNGSoccerCountDownTimer from './components/rng-soccer-countdown-timer';
import { RngSoccerRoundId } from './components/rng-soccer-round-id';
import RNGSoccerSettlementResult from './settlement-result/rng-soccer-settlement-result';
import RNGSoccerStatistic from './statistic/rng-soccer-statistic';

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
    closeConnect() { }

    async showResult(hasAnimation: boolean,
        result?: gc.GameServiceMessage.TResult,
        settlementResult?: gc.GameServiceMessage.TSettlementResult,
    ) {
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
                    onBet={this.handleBetOption}
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
                    isPopupVisible={this.state.isPopupVisible}
                    togglePopup={this.togglePopup}
                />
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
                        this.setState({ isAllowedBet: false });
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
            <Suspense>
                <RNGSoccerSettlementResult
                    namespace={setting.mainObserverNamespace}
                    language={this.props.language}
                />
            </Suspense>
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
        return this.renderStatistic();
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setState({ roundState });
    }

    protected override getGameLayout(): JSX.Element {
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
                {this.renderStatistic()}
            </div>
        );
    }
} 