import { Auth, Connection } from "@sg/sg-game-client";
import { handle, render } from "@sg/sg-observer";
import { ReactNode } from "react";
import { GameBettingZoneContext } from "../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context";
import BetPanelComponent from "../bet-panel/bet-panel";
import { IStateObserver, ObserverComponent } from "../observer-component/observer-component";
import Styles from "./bet-option.module.scss";

export interface IBettingBlockProps {
    children: ReactNode;
    betChoice: string;
    odd: number;
    namespace: string;
}

interface IBettingBlockState extends IStateObserver {
    betChoice: string;
    odd: number;
    show: boolean;
    isAuthorized: boolean;
    isSignedIn: boolean;
}

class BettingBlock extends ObserverComponent<IBettingBlockProps, IBettingBlockState> {
    protected timeoutId: NodeJS.Timeout | null = null;
    protected maxTimeoutDuration = 10000;

    constructor(props: IBettingBlockProps) {
        super(props);

        this.state = {
            betChoice: "",
            odd: 0,
            show: false,
            isAuthorized: false,
            dispose: null,
            isSignedIn: false,
        };

        this.onHide = this.onHide.bind(this);
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
    protected handSignIn(isSignedIn: boolean) {
        isSignedIn && this.setState({ isSignedIn });
    }

    protected onHide() {
        this.setState({ show: false });
    }

    protected handleOnClick() {
        const { betChoice, odd } = this.props;
        const { isAuthorized } = this.state;

        if (!isAuthorized) {
            this.autoCreateNickname();
        }

        this.waitForAuthorization(betChoice, odd);
    }

    protected updateBettingState(betChoice: string, odd: number) {
        this.setState((prevState) => ({
            betChoice,
            odd,
            show: !prevState.show,
        }));
    }

    protected waitForAuthorization(betChoice: string, odd: number) {
        const interval = 100;
        const startTime = Date.now();
        this.clearTimeout();

        const checkAuthorization = () => {
            if (this.state.isAuthorized) {
                this.handleSignIn();
                this.updateBettingState(betChoice, odd);
                this.clearTimeout();
            } else if (Date.now() - startTime < this.maxTimeoutDuration) {
                this.timeoutId = setTimeout(checkAuthorization, interval);
            }
        };
        this.timeoutId = setTimeout(checkAuthorization, interval);
    }

    protected handleSignIn() {
        !this.state.isSignedIn && this.signIn();
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
        const { children, namespace } = this.props;
        const { betChoice, odd, show } = this.state;
        console.log("betChoice", betChoice);

        const bettingZoneState = {
            betChoice,
            odd,
            show,
            onHide: this.onHide,
        };

        return (
            <GameBettingZoneContext.Provider value={bettingZoneState}>
                <div className={Styles["betting-block"]} onClick={this.handleOnClick}>
                    {children}
                </div>
                <BetPanelComponent namespace={namespace} />
            </GameBettingZoneContext.Provider>
        );
    }
}

export default BettingBlock;
