import { Auth } from "@sg/sg-game-client";
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
}

class BettingBlock extends ObserverComponent<IBettingBlockProps, IBettingBlockState> {
    timeoutId: NodeJS.Timeout | null = null;

    constructor(props: IBettingBlockProps) {
        super(props);

        this.state = {
            betChoice: "",
            odd: 0,
            show: false,
            isAuthorized: false,
            dispose: null,
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
    handleAuthorized(isAuthorized: boolean) {
        this.setState({ isAuthorized });
    }

    onHide() {
        this.setState({ show: false });
    }

    handleOnClick() {
        const { betChoice, odd } = this.props;

        if (this.state.isAuthorized) {
            this.updateBettingState(betChoice, odd);
            return;
        }

        this.waitForAuthorization(betChoice, odd);
    }

    updateBettingState(betChoice: string, odd: number) {
        this.setState((prevState) => ({
            betChoice,
            odd,
            show: !prevState.show,
        }));
    }

    waitForAuthorization(betChoice: string, odd: number) {
        const timeoutDuration = 5000;
        const interval = 100;
        const startTime = Date.now();

        const checkAuthorization = () => {
            if (this.state.isAuthorized) {
                this.updateBettingState(betChoice, odd);
                this.clearTimeout();
            } else if (Date.now() - startTime < timeoutDuration) {
                this.timeoutId = setTimeout(checkAuthorization, interval);
            }
        };

        this.clearTimeout();
        this.timeoutId = setTimeout(checkAuthorization, interval);
    }

    clearTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    @handle(Auth.AuthHandlers.Authorize, (handler) => handler.handleAutoGenerateName())
    autoCreateNickname() {}

    render() {
        const { children, namespace } = this.props;
        const { betChoice, odd, show } = this.state;

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
