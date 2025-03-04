import BetOptions, { IBetOptionsState } from "../../../../_shared/components/bet-option";
import BettingBlock from "../../../../_shared/components/bet-option/betting-block";
import Odds from "../../../../_shared/components/bet-option/odd";
import OwnBet from "../../../../_shared/components/bet-option/own-bet";
import TotalBet from "../../../../_shared/components/bet-option/total-bet";
import Styles from "./big-small-options.module.scss";
import { BigSmallChoices } from "../type";
import * as gc from "@sg/sg-game-client";
import { ROUND_STATE } from "@sg/sg-game-client/dist/game/rounds";
import { IPropsObserver } from "../../../../_shared/components/observer-component/observer-component";
import { observer } from "@sg/sg-observer";
import { setting } from "../game-settings";

interface IBigSmallBetOptionsProps extends IPropsObserver {
    roundState: string;
}

interface BetOptionProps {
    odd: number;
    betChoice: string;
    name?: string;
    fractional: boolean;
    isBoostedChoice: boolean;
}

@observer(setting.mainObserverNamespace)
export default class BigSmallBetOptions extends BetOptions {
    declare props: IBigSmallBetOptionsProps;

    private isDisabled(): boolean {
        const { roundState } = this.props;
        return roundState === ROUND_STATE.SHOW_RESULT || roundState === ROUND_STATE.LOCKING_BET;
    }

    private readonly mainChoices = [
        {
            name: `${gc.Translator.t(`UnbalancedBigSmall4.big`)} [11 - 18]`,
            choice: BigSmallChoices.big,
        },
        {
            name: `${gc.Translator.t(`UnbalancedBigSmall4.small`)} [3 - 10]`,
            choice: BigSmallChoices.small,
        },
    ];

    private renderBetOptionContent({ odd, betChoice, name, fractional, isBoostedChoice }: BetOptionProps) {
        return (
            <div className={`${Styles["container-bets"]} ${Styles["padding-bet"]}`}>
                <div>
                    <div className={Styles["main-option"]}>{name}</div>
                </div>
                <Odds value={odd} fractional={fractional} isBoostedChoice={isBoostedChoice} />
            </div>
        );
    }

    private renderBetOption(props: BetOptionProps) {
        const { odd, betChoice, name } = props;
        return (
            <BettingBlock odd={odd} betChoice={betChoice} namespace={this.props.namespace}>
                {this.renderBetOptionContent(props)}
            </BettingBlock>
        );
    }

    public renderSubOptions(betChoice: string, odd: number, fractional: boolean, name: string = "", isBoostedChoice: boolean = false) {
        return this.renderBetOption({ betChoice, odd, name, fractional, isBoostedChoice });
    }

    public renderMainOption(name: string, odd: number, betChoice: string, fractional: boolean, isBoostedChoice: boolean = false) {
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

    render() {
        const { roundOdds, boostedOdds } = this.state as IBetOptionsState;
        const odds = boostedOdds?.values || roundOdds?.odds;
        const boostedChoices = boostedOdds?.boostedChoices || roundOdds?.boostedChoices;
        const fractional = roundOdds?.fractional;
        const isDisabled = this.isDisabled();

        return (
            <div className={`${Styles["bet-options-wrapper"]} ${isDisabled ? Styles["bet-options-disabled"] : ""}`}>
                <div className={Styles["main-options-container"]}>
                    {this.mainChoices.map(({ name, choice }) => (
                        <div
                            key={choice}
                            className={`${Styles["bet"]} ${Styles["bets-bg"]}`}
                        >
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
            </div>
        );
    }
}
