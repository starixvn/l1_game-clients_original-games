import { useEffect, useState } from "react";
import styles from "./bet-panel.module.scss";
import { useTranslation } from "react-i18next";
import { Button, Form } from "react-bootstrap";

export interface BetPanelProps {}

const BetPanel = (props: BetPanelProps) => {
    const { t } = useTranslation("common");
    const [url, setUrl] = useState("");

    useEffect(() => {}, []);

    return (
        <div className={`${styles["bet-panel"]} mt-3 mb-1`}>
            <div className={`${styles["bet-game-name"]} mt-1 mb-1`}>Sedie</div>
            <div className={`${styles["bet-choice-area"]} mt-1 mb-1`}>
                <div className={styles["bet-choice"]}>
                    <div>Even</div>
                </div>
                <div className={`${styles["bet-odds"]} `}>0.96</div>
            </div>
            <Form>
                <Form.Group className="mt-1 mb-1">
                    <Form.Control type="number"></Form.Control>
                    <Form.Label className={`${styles["bet-payout"]} mt-1 mb-1`}>
                        Payout: <span className={`${styles["bet-payout-value"]}`}>2.3</span>
                    </Form.Label>
                </Form.Group>
                <Button type="button" variant="primary" className={`${styles["bet-button"]} mt-1 mb-1`}>
                    Bet
                </Button>
            </Form>
        </div>
    );
};

export default BetPanel;
