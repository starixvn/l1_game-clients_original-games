import SeDieBetOptions from "../../sedie/bet-option/sedie-bet-options";
import Styles from "../vip-sedie.module.scss";

export default class VIPSeDieBetOptions extends SeDieBetOptions {
    componentDidMount() {
        console.log('[VIPSeDieBetOptions] Component mounted');
        super.componentDidMount?.();
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        console.log('[VIPSeDieBetOptions] Component updated', {
            prevState,
            currentState: this.state,
            stateChanged: prevState !== this.state
        });
        super.componentDidUpdate?.(prevProps, prevState);
    }

    public renderSubOptions(betChoice: string, odd: number, fractional: boolean, name: string = "", isBoostedChoice: boolean = false) {
        return super.renderSubOptions(betChoice, odd, fractional, name, isBoostedChoice);
    }

    public renderMainOption(name: string, odd: number, betChoice: string, fractional: boolean, isBoostedChoice: boolean = false) {
        return super.renderMainOption(name, odd, betChoice, fractional, isBoostedChoice);
    }
} 