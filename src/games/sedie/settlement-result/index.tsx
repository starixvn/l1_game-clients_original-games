import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { ROUND_STATE, RoundTimeStore } from "@sg/sg-game-client/dist/game/rounds";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render } from "@sg/sg-observer";
import { Col, Row } from "react-bootstrap";
import { RoundDot } from "../../../_shared/components/dot";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../_shared/components/observer-component/observer-component";
import Styles from "../sedie.module.scss";
import { SeDieChoices } from "../type";
type SeDieResult = {
    red1: boolean;
    red2: boolean;
    red3: boolean;
    red4: boolean;
};
export interface ISeDieSettlementResultState extends IStateObserver {
    result: gc.GameServiceMessage.TResult;
    roundState: string;
}
export default class SeDieSettlementResult extends ObserverComponent<IPropsObserver, ISeDieSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
    }

    @render(RoundTimeStore, (store) => store.roundState)
    handleRoundState(roundState: string) {
        this.setState({ roundState });
    }

    @render(SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) {
            return;
        }
        const { result } = currentFinish;

        if (!result) {
            return;
        }

        this.setState({ result });
    }

    @render(RoundHistoryStore, (store) => store.joinGameHistory)
    handleJoinGameAndShowResult(joinGameHistory: gc.RoundHistories.IJoinGameHistory) {
        const { roundHistory } = joinGameHistory ?? {};
        if (roundHistory) {
            this.setState({ result: roundHistory?.result });
        }
    }

    @render(SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        const { result } = data;

        if (!result) {
            return;
        }

        this.setState({ result });
    }

    renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="large" />);

    renderIcons = (result: any) => {
        return (
            <div className={Styles["container-bets"]}>
                <div className={Styles["wrapper-dots"]}>
                    {this.renderDots(
                        Object.keys(result).map((value) => {
                            return result[value];
                        })
                    )}
                </div>
            </div>
        );
    };

    renderNoResultIcons = (): JSX.Element => {
        return (
            <>
                <RoundDot highlight={true} size="large" value={"?"} />
                <RoundDot highlight={true} size="large" value={"?"} />
                <RoundDot highlight={true} size="large" value={"?"} />
                <RoundDot highlight={true} size="large" value={"?"} />
            </>
        );
    };

    render() {
        const { result, roundState } = this.state;

        return !result || roundState !== ROUND_STATE.SHOW_RESULT ? (
            this.renderNoResultIcons()
        ) : (
            <Row>
                <Col>{this.renderIcons(result)}</Col>
            </Row>
        );
    }
}
