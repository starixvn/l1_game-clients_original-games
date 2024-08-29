import { Col, Container, Row } from "react-bootstrap";
import { RoundDot } from "../../components/dot";
import BetOptions, { IBetOptionsState } from "../../components/game-components/bet-option";
import Odds from "../../components/game-components/bet-option/odd";
import OwnBet from "../../components/game-components/bet-option/own-bet";
import TotalBet from "../../components/game-components/bet-option/total-bet";

import BettingBlock from "../../components/game-components/bet-option/betting-block";
import { settings } from "./game-settings";
import Styles from "./sedie.module.scss";
import { bottomChoices, ChoiceSeDieIconMapper, SeDieChoices, topChoices } from "./type";

export default class SeDieBetOptions extends BetOptions {
    renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="large" />);

    renderSubOptions = (choice: string, odd: number, fractional: boolean) => {
        return (
            <BettingBlock odd={odd} choice={choice} namespace={settings.mainObserverNamespace}>
                <div className={Styles["container-bets"]}>
                    <div className={Styles["wrapper-dots"]}>{this.renderDots(ChoiceSeDieIconMapper[choice])}</div>
                    <Odds value={odd} fractional={fractional} />
                </div>

                <div className={Styles["container-bets"]}>
                    {this.renderTotalBet(choice)}
                    {this.renderOwnBet(choice)}
                </div>
            </BettingBlock>
        );
    };

    renderMainOption = (name: string, odd: number, choice: string, fractional: boolean) => {
        return (
            <BettingBlock odd={odd} choice={choice} namespace={settings.mainObserverNamespace}>
                <div className={`${Styles["container-bets"]} ${Styles["padding-bet"]}`}>
                    <div>
                        <div className={Styles["main-option"]}>{name}</div>
                        {this.renderTotalBet(choice)}
                    </div>
                    <div>
                        <Odds value={odd} fractional={fractional} />
                        {this.renderOwnBet(choice)}
                    </div>
                </div>
            </BettingBlock>
        );
    };

    renderTotalBet(choice: string) {
        return <TotalBet value={this.state?.totalBets?.[choice]} choice={choice} />;
    }

    renderOwnBet(choice: string) {
        return <OwnBet value={this.state?.ownBets?.[choice]} choice={choice} />;
    }

    render() {
        const { roundOdds } = this.state as IBetOptionsState;
        const odds = roundOdds?.odds;
        const fractional = roundOdds?.fractional;
        return (
            <div className="grid-example">
                <Container>
                    <Row>
                        <Col className={`${Styles["bet"]} ${Styles["bets-bg"]}`} sm={3}>
                            {this.renderMainOption("O", odds?.odd, "odd", fractional)}
                        </Col>
                        <Col className={Styles["bet"]} sm={9}>
                            <Row className={Styles["margin-x-0"]}>
                                {Object.keys(SeDieChoices).map((choiceKey) => {
                                    if (topChoices.includes(choiceKey)) {
                                        const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                                        const odd = odds?.[choiceName] || 0;

                                        return (
                                            <Col className={`${Styles["bets-bg"]} ${Styles["padding-bet"]}`} key={choiceKey} sm={4}>
                                                {this.renderSubOptions(choiceKey, odd, fractional)}
                                            </Col>
                                        );
                                    }
                                })}
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col className={`${Styles["bet"]} ${Styles["bets-bg"]}`} sm={3}>
                            {this.renderMainOption("E", odds?.even, "even", fractional)}
                        </Col>
                        <Col className={Styles["bet"]} sm={9}>
                            <Row className={Styles["margin-x-0"]}>
                                {Object.keys(SeDieChoices).map((choiceKey) => {
                                    if (bottomChoices.includes(choiceKey)) {
                                        const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                                        const odd = odds?.[choiceName] || 0;

                                        return (
                                            <Col className={`${Styles["bets-bg"]} ${Styles["padding-bet"]}`} key={choiceKey} sm={4}>
                                                {this.renderSubOptions(choiceKey, odd, fractional)}
                                            </Col>
                                        );
                                    }
                                })}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
