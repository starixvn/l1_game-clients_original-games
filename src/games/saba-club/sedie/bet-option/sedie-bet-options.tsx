import BetOptions, { IBetOptionsState } from "../../../../_shared/components/bet-option";
import BettingBlock from "../../../../_shared/components/bet-option/betting-block";
import Odds from "../../../../_shared/components/bet-option/odd";
import OwnBet from "../../../../_shared/components/bet-option/own-bet";
import TotalBet from "../../../../_shared/components/bet-option/total-bet";
import { RoundDot } from "../../../../_shared/components/dot";
import Styles from "../sedie.module.scss";
import { bottomChoices, ChoiceSeDieIconMapper, SeDieChoices, topChoices } from "../type";

export default class SeDieBetOptions extends BetOptions {
    componentDidMount() {
        console.log('[SeDieBetOptions] Component mounted');
        super.componentDidMount?.();
    }

    componentDidUpdate(prevProps: any, prevState: IBetOptionsState) {
        console.log('[SeDieBetOptions] Component updated', {
            prevState,
            currentState: this.state,
            stateChanged: prevState !== this.state
        });
        super.componentDidUpdate?.(prevProps, prevState);
    }

    protected renderDots(dots: boolean[]) {
        console.log('[SeDieBetOptions] Rendering dots', { dotsArray: dots });
        return dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? SeDieChoices.odd : SeDieChoices.even} size="small" />);
    }

    public renderSubOptions(betChoice: string, odd: number, fractional: boolean, name: string = "", isBoostedChoice: boolean = false) {
        console.log('[SeDieBetOptions] Rendering sub options', {
            betChoice,
            odd,
            fractional,
            name,
            isBoostedChoice
        });
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={this.props.namespace}>
                <div className={`${Styles["container-bets"]} ${Styles["padding-bet"]}`}>
                    <div className={`${Styles["wrapper-dots"]} ${Styles["wrapper-dots-small"]}`}>
                        {this.renderDots(ChoiceSeDieIconMapper[betChoice])}
                    </div>
                    <Odds value={odd} fractional={fractional} isBoostedChoice={isBoostedChoice} />
                </div>
            </BettingBlock>
        );
    }

    public renderMainOption(name: string, odd: number, betChoice: string, fractional: boolean, isBoostedChoice: boolean = false) {
        console.log('[SeDieBetOptions] Rendering main option', {
            name,
            odd,
            betChoice,
            fractional,
            isBoostedChoice
        });
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={this.props.namespace}>
                <div className={`${Styles["container-bets"]} ${Styles["padding-bet"]}`}>
                    <div>
                        <div className={Styles["main-option"]}>{name}</div>
                    </div>
                    <div>
                        <Odds value={odd} fractional={fractional} isBoostedChoice={isBoostedChoice} />
                    </div>
                </div>
            </BettingBlock>
        );
    }

    renderTotalBet(choice: string) {
        console.log('[SeDieBetOptions] Rendering total bet', {
            choice,
            totalBetValue: this.state?.totalBets?.[choice]
        });
        return <TotalBet value={this.state?.totalBets?.[choice]} choice={choice} />;
    }

    renderOwnBet(choice: string) {
        console.log('[SeDieBetOptions] Rendering own bet', {
            choice,
            ownBetValue: this.state?.ownBets?.[choice]
        });
        return <OwnBet value={this.state?.ownBets?.[choice]} choice={choice} />;
    }

    isBoostedChoice(choice: string, boostedChoices: string[]) {
        const isBoosted = boostedChoices ? boostedChoices.includes(choice) : false;
        console.log('[SeDieBetOptions] Checking boosted choice', {
            choice,
            boostedChoices,
            isBoosted
        });
        return isBoosted;
    }

    render() {
        const { roundOdds, boostedOdds } = this.state as IBetOptionsState;
        const odds = boostedOdds ? boostedOdds.values : roundOdds?.odds;
        const boostedChoices = boostedOdds ? boostedOdds.boostedChoices : roundOdds?.boostedChoices;
        const fractional = roundOdds?.fractional;

        console.log('[SeDieBetOptions] Rendering component', {
            roundOdds,
            boostedOdds,
            odds,
            boostedChoices,
            fractional,
            state: this.state
        });

        return (
            <div className={Styles["bet-options-wrapper"]}>
                <div className={`${Styles["bet"]} ${Styles["bets-bg"]}`}>
                    {this.renderMainOption("O", odds?.odd, "odd", fractional, this.isBoostedChoice("odd", boostedChoices))}
                </div>
                {Object.keys(SeDieChoices).map((choiceKey) => {
                    if (topChoices.includes(choiceKey)) {
                        const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                        const odd = odds?.[choiceName] || 0;

                        return (
                            <div className={`${Styles["bets-bg"]}`} key={choiceKey}>
                                {this.renderSubOptions(choiceKey, odd, fractional, "", this.isBoostedChoice(choiceName, boostedChoices))}
                            </div>
                        );
                    }
                })}
                <div className={`${Styles["bet"]} ${Styles["bets-bg"]}`}>
                    {this.renderMainOption("E", odds?.even, "even", fractional, this.isBoostedChoice("even", boostedChoices))}
                </div>
                {Object.keys(SeDieChoices).map((choiceKey) => {
                    if (bottomChoices.includes(choiceKey)) {
                        const choiceName = SeDieChoices[choiceKey as keyof typeof SeDieChoices];
                        const odd = odds?.[choiceName] || 0;

                        return (
                            <div className={`${Styles["bets-bg"]} `} key={choiceKey}>
                                {this.renderSubOptions(choiceKey, odd, fractional, "", this.isBoostedChoice(choiceName, boostedChoices))}
                            </div>
                        );
                    }
                })}
            </div>
        );
    }
}
