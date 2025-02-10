import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { Button, Modal } from "react-bootstrap";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../_shared/components/observer-component/observer-component";

export interface IConfirmBet extends IStateObserver {
    totalStake: number;
    validBet: gc.Bet.IValidBet;
    betChoice: string;
}

export class ConfirmBet extends ObserverComponent<IPropsObserver, IConfirmBet> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            totalStake: 0,
            validBet: {},
            betChoice: "",
        } as IConfirmBet;
        console.log("[ConfirmBet] Initialized with state:", this.state);
    }

    componentDidMount() {
        console.log("[ConfirmBet] Component mounted" + this.props.namespace);
    }

    componentWillUnmount() {
        console.log("[ConfirmBet] Component will unmount" + this.props.namespace);
    }

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet)
    setTotalStake(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        console.log("[ConfirmBet] Received new bet:", lastReceivedBet);
        lastReceivedBet && this.setState({ totalStake: lastReceivedBet.value }, () => {
            console.log("[ConfirmBet] Updated total stake:", this.state.totalStake);
        });
    }

    @render(gc.Bet.BetStore, (store) => store.betChoice)
    setBetChoice(betChoice: string) {
        console.log("[ConfirmBet] Received bet choice:", betChoice);
        betChoice && this.setState({ betChoice }, () => {
            console.log("[ConfirmBet] Updated bet choice:", this.state.betChoice);
        });
    }

    @render(gc.Bet.BetStore, (store) => store.validBet)
    setIsValidBet(validBet: gc.Bet.IValidBet) {
        console.log("[ConfirmBet] Received valid bet update:", validBet);
        this.setState({ validBet }, () => {
            console.log("[ConfirmBet] Updated valid bet state:", this.state.validBet);
        });
    }

    handleClose = () => {
        console.log("[ConfirmBet] Modal closing");
        this.setState({ validBet: { value: false } }, () => {
            console.log("[ConfirmBet] Modal closed, state updated:", this.state);
        });
    };

    render() {
        const { totalStake, validBet, betChoice } = this.state;
        console.log("[ConfirmBet] Rendering with state:", { totalStake, validBet, betChoice });

        return validBet?.value ? (
            <Modal show={true} onHide={this.handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter"> {gc.Translator.t("Common.bet_info")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {" "}
                        {gc.Translator.t("Common.bet_accepted")}: {betChoice}
                    </p>
                    <div>
                        <p>{gc.Translator.t("Common.total_bets")}: 1</p>
                        <p>
                            {gc.Translator.t("Common.total_stake")}: {totalStake}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleClose}>
                        {gc.Translator.t("Common.ok")}
                    </Button>
                </Modal.Footer>
            </Modal>
        ) : (
            <></>
        );
    }
}
