import SeDieBetOptions from "../../sedie/bet-option/sedie-bet-options";
import Styles from "../vip-sedie.module.scss";

export default class VIPSeDieBetOptions extends SeDieBetOptions {
    componentDidMount() {
        super.componentDidMount?.();
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        super.componentDidUpdate?.(prevProps, prevState);
    }

    public renderSubOptions(betChoice: string, odd: number, fractional: boolean, name: string = "", isBoostedChoice: boolean = false) {
        return super.renderSubOptions(betChoice, odd, fractional, name, isBoostedChoice);
    }

    public renderMainOption(name: string, odd: number, betChoice: string, fractional: boolean, isBoostedChoice: boolean = false) {
        return super.renderMainOption(name, odd, betChoice, fractional, isBoostedChoice);
    }
} 