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
import { LuckyNextChoices } from "../type";

type LuckyNextResult = {
    over: boolean;
    under: boolean;
    odd: boolean;
    even: boolean;
};
export interface ILuckyNextSettlementResultState extends IStateObserver {
    result: LuckyNextResult;
}
export default class LuckyNextSettlementResult extends ObserverComponent<IPropsObserver, ILuckyNextSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {} as ILuckyNextSettlementResultState;
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
        this.setState({ result } as ILuckyNextSettlementResultState);
    }

    @render(RoundHistoryStore, (store) => store.joinGameHistory)
    handleJoinGameAndShowResult(joinGameHistory: gc.RoundHistories.IJoinGameHistory) {
        const { roundHistory } = joinGameHistory ?? {};
        if (roundHistory) {
            this.setState({ result: roundHistory?.result } as ILuckyNextSettlementResultState);
        }
    }

    @render(SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        const { result } = data;

        if (!result) {
            return;
        }

        this.setState({ result } as ILuckyNextSettlementResultState);
    }

    renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? LuckyNextChoices.odd : LuckyNextChoices.even} size="large" />);

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
        const { result } = this.state as ILuckyNextSettlementResultState;
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

    private RoundHistoryItem(roundHistory: gc.RoundHistories.RoundHistory): JSX.Element {
        const value = this.getResult(roundHistory.settlementResult);
        const isRed = value === "O";
        console.log(roundHistory.roundId);
        return (
            <Col key={roundHistory.roundId} sm={1}>
                <RoundDot choice={isRed ? LuckyNextChoices.odd : LuckyNextChoices.even} size="large" value={value} />
            </Col>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        let value = "";
        settlementResult &&
            Object.keys(settlementResult).map((choice) => {
                if (settlementResult[choice]) {
                    if (choice === LuckyNextChoices.odd || choice === LuckyNextChoices.even) {
                        value = choice.charAt(0).toUpperCase();
                    }
                }
            });
        return value;
    }
}
