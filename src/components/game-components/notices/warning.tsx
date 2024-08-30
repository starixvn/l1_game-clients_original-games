import * as gc from "@sg/sg-game-client";
import { render } from "observer";
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from "../../../_shared/commom-components/observer-component/observer-component";
import { WarningDialog } from "./warning-dialog";

export interface IWarningState extends IStateObserver {
    warnings: gc.Notices.Warning[];
    processingWarnings: gc.Notices.Warning[];
    isProcessingBet: boolean;
}

const AUTO_HIDE_DURATION = 3000;

export default class Warning extends ObserverComponent<IPropsObserver, IWarningState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            warnings: [],
            processingWarnings: [],
            isProcessingBet: false,
        } as IWarningState;
    }

    @render(gc.Notices.NoticeStore, (store) => store.warning, { fireImmediately: false })
    setNotice(warning: gc.Notices.Warning) {
        this.addWarning(warning);
    }

    @render(gc.Notices.NoticeStore, (store) => store.processingWarning, { fireImmediately: false })
    showProcessingWarning(processingWarning: gc.Notices.Warning) {
        this.addProcessingWarning(processingWarning);
    }

    @render(gc.Bet.BetStore, (store) => store.isProcessingBet, { fireImmediately: false })
    hideProcessingWarning(isProcessingBet: boolean) {
        this.setState({ isProcessingBet });
    }

    addWarning(warning: gc.Notices.Warning) {
        this.setState(
            (prevState) => ({
                warnings: [...prevState.warnings, warning],
            }),
            () => this.scheduleRemoval("warnings", warning)
        );
    }

    addProcessingWarning(processingWarning: gc.Notices.Warning) {
        this.setState(
            (prevState) => ({
                processingWarnings: [...prevState.processingWarnings, processingWarning],
            }),
            () => this.scheduleRemoval("processingWarnings", processingWarning)
        );
    }

    scheduleRemoval(arrayName: "warnings" | "processingWarnings", item: gc.Notices.Warning) {
        setTimeout(() => {
            this.setState((prevState) => {
                const newState = {
                    ...prevState,
                };

                newState[arrayName] = prevState[arrayName].filter((warning) => warning !== item);

                return newState;
            });
        }, AUTO_HIDE_DURATION);
    }

    render() {
        const { warnings, processingWarnings } = this.state;

        return (
            <>
                {warnings.map((warning, index) => (
                    <WarningDialog key={`warning-${index}`} {...warning} />
                ))}

                {processingWarnings.map((processingWarning, index) => (
                    <WarningDialog key={`processingWarning-${index}`} {...processingWarning} />
                ))}
            </>
        );
    }
}
