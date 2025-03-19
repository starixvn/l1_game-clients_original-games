import * as gc from '@sg/sg-game-client';
import { Auth, Connection } from '@sg/sg-game-client';
import { handle, render } from '@sg/sg-observer';
import classNames from 'classnames';
import {
    GameBettingOptionsContext,
    GameBettingZoneContext,
} from '../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context';
import BetPanelComponent from '../bet-panel/bet-panel';
import { IStateObserver, ObserverComponent } from '../observer-component/observer-component';
import Styles from './bet-option.module.scss';

interface BettingBlockProps {
    odd: number;
    betChoice: string;
    gameName: string;
    namespace: string;
    children: React.ReactNode;
    settlementResult?: gc.GameServiceMessage.TSettlementResult;
    customizeClass?: string;
}

interface IBettingBlockState extends IStateObserver {
    betChoice: string;
    odd: number;
    isAuthorized: boolean;
    isSignedIn: boolean;
    isFinishShowResult: boolean;
}

class BettingBlock extends ObserverComponent<BettingBlockProps, IBettingBlockState> {
    private timeoutId: NodeJS.Timeout | null = null;
    private readonly maxTimeoutDuration = 10000;

    constructor(props: BettingBlockProps) {
        super(props);

        this.state = {
            betChoice: '',
            odd: 0,
            isAuthorized: false,
            isSignedIn: false,
            dispose: null,
            isFinishShowResult: false
        };

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        super.componentWillUnmount();
    }

    @render(Auth.AuthStore, (store) => store.isAuthorized)
    protected handleAuthorized(isAuthorized: boolean) {
        this.setState({ isAuthorized });
    }

    @render(Connection.ConnectionStore, (store) => store.isSignedIn)
    protected handleSignIn(isSignedIn: boolean) {
        if (isSignedIn) {
            this.setState({ isSignedIn });
        }
    }

    @handle(gc.Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult() {
        const {isFinishShowResult} = this.state
        this.setState({ isFinishShowResult: true });
        console.log(".......finishShowResult", isFinishShowResult)
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundState)
    renderisFinishShowResult(roundState: string) {
        if (roundState === gc.Rounds.ROUND_STATE.LOCKING_BET || gc.Rounds.ROUND_STATE.PLACING_BET) {
            this.setState({ isFinishShowResult: false});
        }
    }


    protected handleOnClick({ panelId, setPanelId, show, setShow }) {
        return () => {
            const { betChoice, odd } = this.props;
            const { isAuthorized } = this.state;

            if (!isAuthorized) {
                this.autoCreateNickname();
            }

            if (panelId !== betChoice) {
                setPanelId(betChoice);
            } else {
                setPanelId(null);
            }

            this.waitForAuthorization(betChoice, odd);
        };
    }

    protected updateBettingState(betChoice: string, odd: number) {
        this.setState({ betChoice, odd });
    }

    protected waitForAuthorization(betChoice: string, odd: number) {
        const interval = 100;
        const startTime = Date.now();
        this.clearTimeout();

        const checkAuthorization = () => {
            if (this.state.isAuthorized) {
                this.handleUserSignIn();
                this.updateBettingState(betChoice, odd);
                this.clearTimeout();
            } else if (Date.now() - startTime < this.maxTimeoutDuration) {
                this.timeoutId = setTimeout(checkAuthorization, interval);
            }
        };

        this.timeoutId = setTimeout(checkAuthorization, interval);
    }

    protected handleUserSignIn() {
        if (!this.state.isSignedIn) {
            this.signIn();
        }
    }

    protected clearTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    @handle(Auth.AuthHandlers.Authorize, (handler) => handler.handleAutoGenerateName())
    protected autoCreateNickname() {}

    @handle(Connection.ConnectionHandlers.SignInHandler)
    protected signIn() {}

    render() {
        const { children, namespace, gameName, settlementResult, betChoice, customizeClass } = this.props;
        const { odd , isFinishShowResult} = this.state;
        let flashAnimationClass = "";
        const bettingZoneState = {
            gameName,
            betChoice,
            odd,
        };
        if(isFinishShowResult && settlementResult?.[betChoice]) {
            flashAnimationClass = "flash-and-keep-background-color";
        } 
        else if(settlementResult?.[betChoice]) {
            flashAnimationClass = "highlight-static-bet-choice";
        }
        console.log("flashAnimationClass", flashAnimationClass);
        console.log("isFinishShowResult", isFinishShowResult);
        return (
            <GameBettingOptionsContext.Consumer>
                {({ panelId, setPanelId, show, setShow }) => {
                    return (
                        <GameBettingZoneContext.Provider value={bettingZoneState}>
                            <div
                                className={classNames(`${Styles['betting-block']} ${Styles[flashAnimationClass]}`, {
                                    [Styles['open-panel-background-color']]: panelId === betChoice,
                                })}
                                onClick={this.handleOnClick({ panelId, setPanelId, show, setShow })}
                            >
                                {children}
                            </div>
                            <BetPanelComponent namespace={namespace} />
                        </GameBettingZoneContext.Provider>
                    );
                }}
            </GameBettingOptionsContext.Consumer>
        );
    }
}

export default BettingBlock;
