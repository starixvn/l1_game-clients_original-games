import * as gc from "@sg/sg-game-client";
import { isEmpty } from "lodash";
import { render } from "observer";
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from "../../../_shared/commom-components/observer-component/observer-component";

export interface IBetOptionsState extends IStateObserver {
    roundOdds: gc.Rounds.RoundOdds;
    ownBets: gc.GameServiceMessage.OwnBets;
    totalBets: gc.GameServiceMessage.TotalBets;
    userBetPercentage: gc.GameServiceMessage.UserBetPercentage;
    betPercentage: gc.GameServiceMessage.BetPercentage;
    isShowBetPanel: boolean;
}

export default class BetOptions extends ObserverComponent<IPropsObserver, IBetOptionsState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            roundOdds: {},
            ownBets: {},
            totalBets: {},
            userBetPercentage: {},
            betPercentage: {},
            isShowBetPanel: false,
        } as IBetOptionsState;
    }

    @render(gc.Rounds.RoundStore, (store) => store.ownBets, { fireImmediately: false })
    setOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        this.setState({ ownBets });
    }

    @render(gc.Rounds.RoundStore, (store) => store.roundOdds)
    setOdds(roundOdds: gc.Rounds.RoundOdds) {
        this.setState({ roundOdds });
    }

    @render(gc.Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        this.setState({ totalBets });
    }

    @render(gc.Rounds.RoundStore, (store) => store.userBetPercentage)
    handleUserBetPercentage(userBetPercentage: gc.GameServiceMessage.UserBetPercentage) {
        this.setState({ userBetPercentage });
    }

    @render(gc.Rounds.RoundStore, (store) => store.betPercentage)
    handleBetPercentage(betPercentage: gc.GameServiceMessage.BetPercentage) {
        this.setState({ betPercentage });
    }

    @render(gc.Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) {
            return;
        }
        this.clearHighlightStatic();
        this.clearHighlightAnim();
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }
        const { roundHistory, staticHighlight, animationHighlight } = firstJoinGameHistory;
        roundHistory && this.setHighlightStatic(staticHighlight, animationHighlight, roundHistory);
    }

    protected setHighlightStatic(staticHighlight: boolean, animationHighlight: boolean, roundHistory: gc.RoundHistories.RoundHistory) {
        if (staticHighlight || animationHighlight) {
            this.showHighlightStatic(roundHistory.settlementResult);
        }
    }

    @render(gc.Rounds.RoundStore, (store) => store.isResetHighlight)
    handleResetHighlight(isResetHighlight: boolean) {
        if (isResetHighlight) {
            this.clearHighlightStatic();
        }
    }

    @render(gc.Rounds.RoundStore, (store) => store.highlightStatic, { fireImmediately: false })
    handleHighlightStatic(highlightStatic: gc.Rounds.THighlightStatic) {
        if (!isEmpty(highlightStatic?.settlementResult)) {
            this.showHighlightStatic(highlightStatic.settlementResult);
        } else {
            this.clearHighlightStatic();
        }
    }

    protected showHighlightStatic(settlementResult: gc.GameServiceMessage.TSettlementResult) {}
    protected showAnimationHighlight(settlementResult: gc.GameServiceMessage.TSettlementResult) {}
    protected clearHighlightStatic() {}
    protected clearHighlightAnim() {}

    renderSubOptions(choice: string, odd: number, fractional: boolean) {
        return <></>;
    }

    renderMainOption = (name: string, odd: number, choice: string, fractional: boolean) => {
        return <></>;
    };

    renderTotalBet(choice: string) {
        return <></>;
    }

    renderOwnBet(choice: string) {
        return <></>;
    }

    render() {
        return <></>;
    }
}
