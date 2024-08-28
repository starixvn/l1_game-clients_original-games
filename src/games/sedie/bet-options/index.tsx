import * as gc from "@sg/sg-game-client";
import { render } from "observer";
import { Col, Container, Row } from "react-bootstrap";
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from "../../../_shared/commom-components/observer-component/observer-component";
import { RoundDot } from "../../../components/dot";
import Styles from "../sedie.module.scss";
import { bottomChoices, ChoiceSeDieIconMapper, SeDieChoices, topChoices } from "../type";

export interface ISeDieBetOptionsState extends IStateObserver {
    roundOdds: gc.Rounds.RoundOdds;
    ownBets: gc.GameServiceMessage.OwnBets;
    totalBets: gc.GameServiceMessage.TotalBets;
    userBetPercentage: gc.GameServiceMessage.UserBetPercentage;
    betPercentage: gc.GameServiceMessage.BetPercentage;
}
export default class SeDieBetOptions extends ObserverComponent<IPropsObserver, ISeDieBetOptionsState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            roundOdds: {},
            ownBets: {},
            totalBets: {},
            userBetPercentage: {},
            betPercentage: {},
        } as ISeDieBetOptionsState;
    }

    @render(gc.Rounds.RoundStore, (store) => store.ownBets, { fireImmediately: false })
    renderOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        this.setState({ ownBets } as ISeDieBetOptionsState);
        console.log("ownBets: ", ownBets);
    }

    @render(gc.Rounds.RoundStore, (store) => store.roundOdds)
    renderOdds(roundOdds: gc.Rounds.RoundOdds) {
        this.setState({ roundOdds } as ISeDieBetOptionsState);
    }

    renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="large" />);

    renderIcons = (choice: string, oddsValue: number) => {
        return (
            <div className={Styles["container-bets"]}>
                <div className={Styles["wrapper-dots"]}>{this.renderDots(ChoiceSeDieIconMapper[choice])}</div>
                <div className={Styles["odd"]}>{oddsValue}</div>
            </div>
        );
    };

    renderMainOption = (name: string, odd: number) => {
        return (
            <div className={`${Styles["container-bets"]} ${Styles["padding-bet"]}`}>
                <div className={Styles["main-option"]}>{name}</div>
                <div className={Styles["odd"]}>{odd || 0}</div>
            </div>
        );
    };

    render() {
        const { roundOdds } = this.state as ISeDieBetOptionsState;
        const odds = roundOdds?.odds;
        return (
            <div className="grid-example">
                <Container>
                    <Row>
                        <Col className={Styles["bet"]} sm={3}>
                            {this.renderMainOption("O", odds?.odd)}
                        </Col>
                        <Col className={Styles["bet"]} sm={9}>
                            <Row>
                                {Object.keys(SeDieChoices).map((choiceKey) => {
                                    if (topChoices.includes(choiceKey)) {
                                        const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                                        const oddsValue = odds?.[choiceName] || 0;

                                        return (
                                            <Col className={`${Styles["border-right"]} ${Styles["padding-bet"]}`} key={choiceKey} sm={4}>
                                                {this.renderIcons(choiceKey, oddsValue)}
                                            </Col>
                                        );
                                    }
                                })}
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col className={Styles["bet"]} sm={3}>
                            {this.renderMainOption("E", odds?.even)}
                        </Col>
                        <Col className={Styles["bet"]} sm={9}>
                            <Row>
                                {Object.keys(SeDieChoices).map((choiceKey) => {
                                    if (bottomChoices.includes(choiceKey)) {
                                        const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                                        const oddsValue = odds?.[choiceName] || 0;

                                        return (
                                            <Col className={`${Styles["border-right"]} ${Styles["padding-bet"]}`} key={choiceKey} sm={4}>
                                                {this.renderIcons(choiceKey, oddsValue)}
                                            </Col>
                                        );
                                    }
                                })}
                            </Row>
                        </Col>
                    </Row>
                </Container>

                {/* <BetPanel /> */}
            </div>
        );
    }
}
