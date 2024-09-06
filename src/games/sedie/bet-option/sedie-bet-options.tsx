import BetOptions, { IBetOptionsState } from "../../../_shared/components/bet-option";
import BettingBlock from "../../../_shared/components/bet-option/betting-block";
import Odds from "../../../_shared/components/bet-option/odd";
import OwnBet from "../../../_shared/components/bet-option/own-bet";
import TotalBet from "../../../_shared/components/bet-option/total-bet";
import { RoundDot } from "../../../_shared/components/dot";
import { settingsSeDie } from "../game-settings";
import Styles from "../sedie.module.scss";
import { bottomChoices, ChoiceSeDieIconMapper, SeDieChoices, topChoices } from "../type";

export default class SeDieBetOptions extends BetOptions {
    renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="small" />);

    renderSubOptions = (betChoice: string, odd: number, fractional: boolean) => {
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={settingsSeDie.mainObserverNamespace}>
                <div className={Styles["container-bets"]}>
                    <div className={`${Styles["wrapper-dots"]} ${Styles["wrapper-dots-small"]}`}>
                        {this.renderDots(ChoiceSeDieIconMapper[betChoice])}
                    </div>
                    <Odds value={odd} fractional={fractional} />
                </div>
            </BettingBlock>
        );
    };

    renderMainOption = (name: string, odd: number, betChoice: string, fractional: boolean) => {
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={settingsSeDie.mainObserverNamespace}>
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
            <div className={Styles["bet-options-wrapper"]}>
                <div className={`${Styles["bet"]} ${Styles["bets-bg"]}`}>{this.renderMainOption("O", odds?.odd, "odd", fractional)}</div>
                {Object.keys(SeDieChoices).map((choiceKey) => {
                    if (topChoices.includes(choiceKey)) {
                        const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                        const odd = odds?.[choiceName] || 0;

                        return (
                            <div className={`${Styles["bets-bg"]} ${Styles["padding-bet"]}`} key={choiceKey}>
                                {this.renderSubOptions(choiceKey, odd, fractional)}
                            </div>
                        );
                    }
                })}
                <div className={`${Styles["bet"]} ${Styles["bets-bg"]}`}>{this.renderMainOption("E", odds?.even, "even", fractional)}</div>
                {Object.keys(SeDieChoices).map((choiceKey) => {
                    if (bottomChoices.includes(choiceKey)) {
                        const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                        const odd = odds?.[choiceName] || 0;

                        return (
                            <div className={`${Styles["bets-bg"]} ${Styles["padding-bet"]}`} key={choiceKey}>
                                {this.renderSubOptions(choiceKey, odd, fractional)}
                            </div>
                        );
                    }
                })}
            </div>
        );
    }
}
