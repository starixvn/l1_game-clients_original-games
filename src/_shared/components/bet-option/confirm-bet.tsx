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
    }

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet)
    setTotalStake(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        lastReceivedBet && this.setState({ totalStake: lastReceivedBet.value });
    }
    @render(gc.Bet.BetStore, (store) => store.betChoice)
    setBetChoice(betChoice: string) {
        betChoice && this.setState({ betChoice });
    }

    @render(gc.Bet.BetStore, (store) => store.validBet)
    setIsValidBet(validBet: gc.Bet.IValidBet) {
        this.setState({ validBet });
    }

    handleClose = () => {
        this.setState({ validBet: { value: false } });
    };

    render() {
        const { totalStake, validBet, betChoice } = this.state;
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
