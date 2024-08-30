import * as gc from "@sg/sg-game-client";
import { RoundHistoryStore } from "@sg/sg-game-client/dist/game/round-histories";
import { SettlementStore } from "@sg/sg-game-client/dist/game/settlements";
import { render } from "observer";
import { Col, Row } from "react-bootstrap";
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from "../../../_shared/commom-components/observer-component/observer-component";
import { RoundDot } from "../../../components/dot";
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
}
export default class SeDieSettlementResult extends ObserverComponent<IPropsObserver, ISeDieSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
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

        console.log("renderCurrentFinish");
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

    render() {
        const { result } = this.state;
        if (!result) {
            return <></>;
        }

        console.log("result", result);
        return (
            <Row>
                <Col>{this.renderIcons(result)}</Col>
            </Row>
        );
    }
}
