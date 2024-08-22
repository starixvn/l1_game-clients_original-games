import React from "react";
import { PlayerContext } from "../../_shared/react-contexts/auth";
import { GameContextProvider } from "../../_shared/react-contexts/game-context/game-context";
import GameContainer from "../game-components";
import { GameBaseProps } from "./type";

abstract class GameBase<P extends GameBaseProps> extends React.PureComponent<P> {
    constructor(props: P) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.onStart();
    }

    componentWillUnmount() {
        this.onDestroy();
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    onDestroy() {
        this.clearGameTimeoutAndInterval();
    }

    clearGameTimeoutAndInterval = () => {};

    onStart() {
        this.connectToGameService();
    }

    protected async connectToGameService() {
        // const { session } = this.context as PlayerContextModel;
        // const { socketInfo, gameName } = this.props;
        // const { socket } = InitSocketIO(socketInfo, session, gameName, this.gameMessageHandler);
        // this.socket = socket;
    }

    onVisibilityChange = () => {
        document.visibilityState === "hidden" ? this.onDestroy() : this.onStart();
    };

    onConnectFailed() {}

    onSocketDisconnect() {}

    onGameServiceConnected() {}

    handleUM() {
        // handle
    }

    handleRoundHistory() {
        // handle
    }

    handleGamePlay(remainingTime: number) {}

    async updateUserBalance() {}

    placeBet(betChoice: string, amount: number) {}

    renderNotice() {
        return <></>;
    }

    renderRoundIdSection() {
        return <></>;
    }

    renderHeaderBlock() {
        return <></>;
    }

    renderBetHistoryModal() {
        return <></>;
    }

    renderGameGuideModal() {
        return <></>;
    }

    renderMenuButtons() {
        return <></>;
    }

    renderResultBlock() {
        return <></>;
    }

    renderBettingBlock() {
        return <></>;
    }

    renderScoreboards() {
        return <></>;
    }

    renderSlidingChips() {
        return <></>;
    }

    renderConfirmBet() {
        return <></>;
    }

    renderConfirmDialog() {
        return <></>;
    }

    renderStatistic() {
        return <></>;
    }

    renderStatisticContent() {
        return <></>;
    }

    renderNewRoundTransition() {
        return <></>;
    }

    getRenderTemplate() {
        return <></>;
    }

    renderGame() {
        const gameActionsContext = {
            placeBet: this.placeBet,
        };

        return <GameContextProvider value={{ ...this.props }}>{this.getRenderTemplate()}</GameContextProvider>;
    }

    protected retryConnect() {}

    render() {
        return <GameContainer>{this.renderGame()}</GameContainer>;
    }
}

GameBase.contextType = PlayerContext;

export default GameBase;
