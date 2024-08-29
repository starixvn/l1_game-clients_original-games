import * as gc from "@sg/sg-game-client";
import { render } from "observer";
import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from "../../../_shared/commom-components/observer-component/observer-component";
import { useGameBettingZoneContext } from "../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context";
import styles from "./bet-panel.module.scss";

export interface IBetPanel extends IStateObserver {
    stakeLevel: any;
    minBet: number;
    maxBet: number;
    maxBetPerChoices: gc.GameServiceMessage.MaxBetPerChoices;
}

class BetPanelComponent<P extends IPropsObserver, S extends IBetPanel> extends ObserverComponent<IPropsObserver, IStateObserver> {
    constructor(props: P) {
        super(props);
        this.state = {
            dispose: null,
            stakeLevel: {},
            minBet: 0,
            maxBet: 0,
            maxBetPerChoices: {},
        } as S;
    }

    @render(gc.Player.MainPlayerStore, (store) => store.stakeLevel, { fireImmediately: false })
    setUserStakeLevel(stakeLevel: gc.Player.IStakeLevel) {
        this.setState({ stakeLevel } as IBetPanel);
        console.log("stakeLevel", stakeLevel);
    }

    @render(gc.Rounds.RoundStore, (store) => store.minBet, { fireImmediately: false })
    setMinBet(minBet: number) {
        this.setState({ minBet } as IBetPanel);
    }

    @render(gc.Rounds.RoundStore, (store) => store.maxBet, { fireImmediately: false })
    setMaxBet(maxBet: number) {
        this.setState({ maxBet } as IBetPanel);
    }

    @render(gc.GameConfigs.GameConfigStore, (store) => store.maxBetPerChoices, { fireImmediately: false })
    setMaxBetPerChoices(maxBetPerChoices: gc.GameServiceMessage.MaxBetPerChoices) {
        this.setState({ maxBetPerChoices } as IBetPanel);
        console.log("maxBetPerChoices", maxBetPerChoices);
    }

    render() {
        const { minBet, maxBet, maxBetPerChoices } = this.state as S;
        return <BetPanel minBet={minBet} maxBet={maxBet} maxBetPerChoices={maxBetPerChoices}></BetPanel>;
    }
}

const BetPanel: React.FC<{ minBet: number; maxBet: number; maxBetPerChoices: gc.GameServiceMessage.MaxBetPerChoices }> = ({
    minBet = 1,
    maxBet = 300,
    maxBetPerChoices,
}) => {
    const { choice, odd = 0, onHide, show } = useGameBettingZoneContext();
    const { t } = useTranslation("common");
    const [amount, setAmount] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    useEffect(() => {
        console.log("maxBetPerChoices?.[choice]", choice && maxBetPerChoices?.[choice], maxBetPerChoices);
        setMin(minBet);
        choice && setMax(Math.min(maxBetPerChoices?.[choice] || 0, maxBet));
    }, [maxBetPerChoices, minBet, maxBet, choice]);

    const handleAmount = (event: any) => {
        setAmount(+event?.target.value || 0);
    };
    console.log("amount", amount);

    if (!show) {
        return <></>;
    }

    return (
        <Modal show={true} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Bet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={`${styles["bet-panel"]} mt-3 mb-1`}>
                    {/* <div className={`${styles["bet-game-name"]} mt-1 mb-1`}>Sedie</div> */}
                    <div className={`${styles["bet-choice-area"]} mt-1 mb-1`}>
                        <div className={styles["bet-choice"]}>
                            <div>{choice || ""}</div>
                        </div>
                        <div className={`${styles["bet-odds"]} `}>{odd || 0}</div>
                    </div>
                    <div className={`${styles["bet-choice-area"]} mt-1 mb-1`}>
                        <div className={styles["bet-choice"]}>Range: MinBet - MaxBet</div>
                        <div className={`${styles["bet-odds"]} `}>
                            {min || 0} - {max || 0}
                        </div>
                    </div>
                    <div></div>
                    <Form>
                        <Form.Group className="mt-1 mb-1">
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="number"
                                    placeholder={`Enter a number between ${min} and ${max}`}
                                    onChange={handleAmount}
                                    isInvalid={amount > max || amount < min}
                                ></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    Range: {min} - {max}
                                </Form.Control.Feedback>
                            </InputGroup>

                            <Form.Label className={`${styles["bet-payout"]} mt-1 mb-1`}>
                                Payout: <span className={`${styles["bet-payout-value"]}`}>{amount * odd}</span>
                            </Form.Label>
                        </Form.Group>
                        <Button type="button" variant="primary" className={`${styles["bet-button"]} mt-1 mb-1`}>
                            Bet
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BetPanelComponent;
