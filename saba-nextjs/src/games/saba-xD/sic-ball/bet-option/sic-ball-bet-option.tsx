import * as gc from "@sg/sg-game-client";
import { Stack } from "react-bootstrap";
import BetOptions, { IBetOptionsState } from "../../../../_shared/components/bet-option";
import BettingBlock from "../../../../_shared/components/bet-option/betting-block";
import Odds from "../../../../_shared/components/bet-option/odd";
import { setting } from "../game-settings";
import Styles from "../sic-ball.module.scss";
// import styles from "../../../lobby/lobby.module.scss";

import { bottomChoices, topChoices, SicBallChoices, SicBallSubChoicesOdds } from "../type";
const gameSetting = setting;
export default class SicBallBetOptions extends BetOptions {
    renderMainOption = (name: string, odd: number, betChoice: string, fractional: boolean) => {
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={gameSetting.mainObserverNamespace}>
                <div className={`${Styles["container-bets"]} ${Styles["padding-bet"]}`}>
                    <div>
                        <div className={Styles["main-option"]}>{name}</div>
                    </div>
                    <div>
                        <Odds value={odd} fractional={fractional} />
                    </div>
                </div>
            </BettingBlock>
        );
    };
    renderSubOptions = (betChoice: string, odd: number, fractional: boolean, name: string) => {
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={gameSetting.mainObserverNamespace}>
                <div className={`${Styles["container-bets"]} ${Styles["sub-option"]}`}>
                    <div>
                        <div>{name}</div>
                    </div>
                    <Odds value={odd} fractional={fractional} />
                </div>
            </BettingBlock>
        );
    };

    render() {
        const { roundOdds } = this.state as IBetOptionsState;
        const odds = roundOdds?.odds;
        const fractional = roundOdds?.fractional;
        return (
            <div className={Styles["bet-options-wrapper"]}>
                <Stack direction="horizontal">
                    <Stack></Stack>
                </Stack>
                <Stack direction="vertical">
                    <Stack direction="horizontal" gap={3} className="justify-content-center" style={{ alignItems: "center" }}>
                        {Object.keys(SicBallSubChoicesOdds).map((choiceKey) => {
                            if (odds && Object.keys(odds).includes(choiceKey)) {
                                const subOdd = odds[choiceKey];
                                return (
                                    <div key={choiceKey}>
                                        <div>
                                            {gc.Translator.t(`${gameSetting.gameName}.odds_${choiceKey}`)} 1 : {subOdd}
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </Stack>

                    <Stack direction="horizontal" className="justify-content-center">
                        <div className={`${Styles["bet"]} ${Styles["bets-bg"]}`}>
                            {this.renderMainOption("B", odds?.[SicBallChoices.big], SicBallChoices.big, fractional)}
                        </div>
                        {Object.keys(SicBallChoices).map((choiceKey) => {
                            if (topChoices.includes(choiceKey)) {
                                const choiceName = SicBallChoices[choiceKey as keyof typeof SicBallChoices];
                                const odd = odds?.[choiceName] || 0;

                                return (
                                    <div
                                        className={`${Styles["bets-bg"]} ${Styles["padding-bet"]} ${Styles["sub-option-container"]}`}
                                        key={choiceKey}
                                    >
                                        {this.renderSubOptions(
                                            choiceName,
                                            odd,
                                            fractional,
                                            `${choiceName.substring(choiceName.length - 1)}`
                                        )}
                                    </div>
                                );
                            }
                        })}
                    </Stack>
                    <Stack direction="horizontal" className="justify-content-center">
                        <div className={`${Styles["bet"]} ${Styles["bets-bg"]}`}>
                            {this.renderMainOption("S", odds?.[SicBallChoices.small], SicBallChoices.small, fractional)}
                        </div>
                        {Object.keys(SicBallChoices).map((choiceKey) => {
                            if (bottomChoices.includes(choiceKey)) {
                                const choiceName = SicBallChoices[choiceKey as keyof typeof SicBallChoices];
                                const odd = odds?.[choiceName] || 0;

                                return (
                                    <div
                                        className={`${Styles["bets-bg"]} ${Styles["padding-bet"]} ${Styles["sub-option-container"]}`}
                                        key={choiceKey}
                                    >
                                        {this.renderSubOptions(
                                            choiceName,
                                            odd,
                                            fractional,
                                            `${choiceName.substring(choiceName.length - 1)}`
                                        )}
                                    </div>
                                );
                            }
                        })}
                    </Stack>
                </Stack>
            </div>
        );
    }
}
