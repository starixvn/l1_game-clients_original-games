import * as gc from "@sg/sg-game-client";
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
    result: SeDieResult;
}
export default class SeDieSettlementResult extends ObserverComponent<IPropsObserver, ISeDieSettlementResultState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {} as ISeDieSettlementResultState;
    }

    @render(SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        const { result } = data;

        if (!result) {
            return;
        }

        this.setState({ result } as ISeDieSettlementResultState);
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
        const { result } = this.state as ISeDieSettlementResultState;
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
                <RoundDot choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="large" value={value} />
            </Col>
        );
    }

    private getResult(settlementResult: gc.GameServiceMessage.TSettlementResult): string {
        let value = "";
        Object.keys(settlementResult).map((choice) => {
            if (settlementResult[choice]) {
                if (choice === SeDieChoices.odd || choice === SeDieChoices.even) {
                    value = choice.charAt(0).toUpperCase();
                }
            }
        });
        return value;
    }
}
