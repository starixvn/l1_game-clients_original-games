import { Col, Container, Row } from "react-bootstrap";
import { IPropsObserver } from "../../_shared/commom-components/observer-component/observer-component";
import { RoundDot } from "../../components/dot";
import BetOptions, { IBetOptionsState } from "../../components/game-components/bet-option";
import Odds from "../../components/game-components/bet-option/odd";
import OwnBet from "../../components/game-components/bet-option/own-bet";
import TotalBet from "../../components/game-components/bet-option/total-bet";

import BettingBlock from "../../components/game-components/bet-option/betting-block";
import { settings } from "./game-settings";
import Styles from "./lucky-next.module.scss";
import { LuckyNextChoices } from "./type";

export default class LuckyNextBetOptions extends BetOptions<IPropsObserver, IBetOptionsState> {
    renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? LuckyNextChoices.odd : LuckyNextChoices.even} size="large" />);

    renderSubOptions = (choice: string, odd: number, fractional: boolean) => {
        return (
            <BettingBlock odd={odd} choice={choice} namespace={settings.mainObserverNamespace}>
                <div className={Styles["container-bets"]}>
                    {/* <div className={Styles["wrapper-dots"]}>{this.renderDots(ChoiceSeDieIconMapper[choice])}</div> */}
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
        return <TotalBet value={this.getState().totalBets?.[choice]} choice={choice} />;
    }

    renderOwnBet(choice: string) {
        return <OwnBet value={this.getState().ownBets?.[choice]} choice={choice} />;
    }

    render() {
        const { roundOdds } = this.state as IBetOptionsState;
        const odds = roundOdds?.odds;
        const fractional = roundOdds?.fractional;
        return (
            <div className="grid-example">
                <Container>
                    <Row>
                        <Col className={Styles["bet"]} sm={3}>
                            {this.renderMainOption("O", odds?.odd, "odd", fractional)}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
