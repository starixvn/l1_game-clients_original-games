import * as gc from "@sg/sg-game-client";
import { render } from "observer";
import { Col, Container, Row } from "react-bootstrap";
import {
    IPropsObserver,
    IStatesObserver,
    ObserverComponent,
} from "../../../_shared/commom-components/observer-component/observer-component";
import Style from "../sedie.module.scss";
import { SeDieChoices } from "../type";

export interface ISeDieBetOptionsStates extends IStatesObserver {
    roundOdds: gc.Rounds.RoundOdds;
    ownBets: gc.GameServiceMessage.OwnBets;
    totalBets: gc.GameServiceMessage.TotalBets;
    userBetPercentage: gc.GameServiceMessage.UserBetPercentage;
    betPercentage: gc.GameServiceMessage.BetPercentage;
}

export default class SeDieBetOptions extends ObserverComponent<IPropsObserver, ISeDieBetOptionsStates> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            roundOdds: {},
            ownBets: {},
            totalBets: {},
            userBetPercentage: {},
            betPercentage: {},
        } as ISeDieBetOptionsStates;
    }

    @render(gc.Rounds.RoundStore, (store) => store.ownBets, { fireImmediately: false })
    renderOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        this.setState({ ownBets } as ISeDieBetOptionsStates);
        console.log("ownBets: ", ownBets);
    }

    @render(gc.Rounds.RoundStore, (store) => store.roundOdds)
    renderOdds(roundOdds: gc.Rounds.RoundOdds) {
        this.setState({ roundOdds } as ISeDieBetOptionsStates);
    }

    render() {
        const { roundOdds } = this.state as ISeDieBetOptionsStates;
        const odds = roundOdds?.odds as any;
        console.log("odds", odds);
        return (
            <div className="grid-example">
                <Container>
                    <Row>
                        <Col className={Style["bet"]} sm={6}>
                            {`Even - ${odds?.even || 0}`}
                        </Col>
                        <Col className={Style["bet"]} sm={6}>
                            {`Odd - ${odds?.odd || 0}`}
                        </Col>
                    </Row>

                    <Row>
                        {Object.keys(SeDieChoices).map((choiceKey) => {
                            const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                            const oddsValue = odds?.[choiceName] || 0;

                            return (
                                <Col key={choiceKey} className={Style["bet"]} sm>
                                    {`${choiceKey.replace("Red", " Red").replace("White", " White")} - ${oddsValue}`}
                                </Col>
                            );
                        })}
                    </Row>
                    {odds && Object.keys(odds)?.forEach((choice) => {
                        console.log("choice: ", choice);
                        console.log("odds[choice]", odds[choice]);
                    })}
                </Container>
            </div>
        );
    }
}
