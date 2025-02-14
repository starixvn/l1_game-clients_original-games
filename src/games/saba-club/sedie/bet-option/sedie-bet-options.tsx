import BetOptions, { IBetOptionsState } from "../../../../_shared/components/bet-option";
import BettingBlock from "../../../../_shared/components/bet-option/betting-block";
import Odds from "../../../../_shared/components/bet-option/odd";
import OwnBet from "../../../../_shared/components/bet-option/own-bet";
import TotalBet from "../../../../_shared/components/bet-option/total-bet";
import { RoundDot } from "../../../../_shared/components/dot";
import Styles from "../sedie.module.scss";
import { bottomChoices, ChoiceSeDieIconMapper, SeDieChoices, topChoices } from "../type";

interface BetOptionProps {
    odd: number;
    betChoice: string;
    name?: string;
    fractional: boolean;
    isBoostedChoice: boolean;
}

/**
 * SeDieBetOptions Component
 * Renders betting options for the Se Die game with main and sub-options
 * Extends the base BetOptions component with Se Die specific rendering logic
 */
export default class SeDieBetOptions extends BetOptions {
    private renderDots(dots: boolean[]) {
        return dots.map((isRed, index) => (
            <RoundDot
                key={index}
                choice={isRed ? SeDieChoices.odd : SeDieChoices.even}
                size="small"
            />
        ));
    }

    private renderBetOptionContent({ odd, betChoice, name, fractional, isBoostedChoice }: BetOptionProps) {
        return (
            <div className={`${Styles["container-bets"]} ${Styles["padding-bet"]}`}>
                {name ? (
                    <div>
                        <div className={Styles["main-option"]}>{name}</div>
                    </div>
                ) : (
                    <div className={`${Styles["wrapper-dots"]} ${Styles["wrapper-dots-small"]}`}>
                        {this.renderDots(ChoiceSeDieIconMapper[betChoice])}
                    </div>
                )}
                <Odds
                    value={odd}
                    fractional={fractional}
                    isBoostedChoice={isBoostedChoice}
                />
            </div>
        );
    }

    private renderBetOption(props: BetOptionProps) {
        const { odd, betChoice } = props;
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={this.props.namespace}>
                {this.renderBetOptionContent(props)}
            </BettingBlock>
        );
    }

    public renderSubOptions(
        betChoice: string,
        odd: number,
        fractional: boolean,
        name: string = "",
        isBoostedChoice: boolean = false
    ) {
        return this.renderBetOption({ betChoice, odd, name, fractional, isBoostedChoice });
    }

    public renderMainOption(
        name: string,
        odd: number,
        betChoice: string,
        fractional: boolean,
        isBoostedChoice: boolean = false
    ) {
        return this.renderBetOption({ name, odd, betChoice, fractional, isBoostedChoice });
    }

    public renderTotalBet(choice: string) {
        return <TotalBet value={this.state?.totalBets?.[choice]} choice={choice} />;
    }

    public renderOwnBet(choice: string) {
        return <OwnBet value={this.state?.ownBets?.[choice]} choice={choice} />;
    }

    private isBoostedChoice(choice: string, boostedChoices: string[] | undefined): boolean {
        return boostedChoices ? boostedChoices.includes(choice) : false;
    }

    private renderChoiceOptions(
        choices: string[],
        odds: Record<string, number> | undefined,
        fractional: boolean | undefined,
        boostedChoices: string[] | undefined
    ) {
        return choices.map((choiceKey) => {
            const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
            const odd = odds?.[choiceName] || 0;

            return (
                <div className={Styles["bets-bg"]} key={choiceKey}>
                    {this.renderSubOptions(
                        choiceKey,
                        odd,
                        !!fractional,
                        "",
                        this.isBoostedChoice(choiceName, boostedChoices)
                    )}
                </div>
            );
        });
    }

    render() {
        const { roundOdds, boostedOdds } = this.state as IBetOptionsState;
        const odds = boostedOdds?.values || roundOdds?.odds;
        const boostedChoices = boostedOdds?.boostedChoices || roundOdds?.boostedChoices;
        const fractional = roundOdds?.fractional;

        return (
            <div className={Styles["bet-options-wrapper"]}>
                <div className={Styles["main-options-container"]}>
                    {[
                        { name: "O", choice: "odd" },
                        { name: "E", choice: "even" }
                    ].map(({ name, choice }) => (
                        <div key={choice} className={`${Styles["bet"]} ${Styles["bets-bg"]}`}>
                            {this.renderMainOption(
                                name,
                                odds?.[choice] || 0,
                                choice,
                                !!fractional,
                                this.isBoostedChoice(choice, boostedChoices)
                            )}
                        </div>
                    ))}
                </div>
                <div className={Styles["sub-options-container"]}>
                    {this.renderChoiceOptions(topChoices, odds, fractional, boostedChoices)}
                    {this.renderChoiceOptions(bottomChoices, odds, fractional, boostedChoices)}
                </div>
            </div>
        );
    }
}
