import BetOptions, { IBetOptionsState } from "../../../../_shared/components/bet-option";
import BettingBlock from "../../../../_shared/components/bet-option/betting-block";
import Odds from "../../../../_shared/components/bet-option/odd";
import OwnBet from "../../../../_shared/components/bet-option/own-bet";
import TotalBet from "../../../../_shared/components/bet-option/total-bet";
import Styles from "../lucky-next.module.scss";
import { LuckyNextChoices } from "../type";

export default class LuckyNextBetOptions extends BetOptions {
    renderMainOption = (name: string, odd: number, betChoice: string, fractional: boolean) => {
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={this.props.namespace}>
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
        if (odds) {
            return (
                <div className={Styles["bet-options-wrapper"]}>
                    {Object.keys(LuckyNextChoices).map((choiceKey) => {
                        return (
                            <div className={`${Styles["bets-bg"]} ${Styles["padding-bet"]}`} key={choiceKey}>
                                {this.renderMainOption(choiceKey[0], odds[choiceKey], choiceKey, fractional)}
                            </div>
                        );
                    })}
                </div>
            );
        }
        return <></>;
    }
}
