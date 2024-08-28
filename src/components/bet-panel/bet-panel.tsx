import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./bet-panel.module.scss";

export interface BetPanelProps {
    choiceName: string;
    odd: number;
}

const BetPanel = (props: BetPanelProps) => {
    const { choiceName, odd } = props;
    const { t } = useTranslation("common");
    const [url, setUrl] = useState("");

    useEffect(() => {}, []);

    return (
        <div className={`${styles["bet-panel"]} mt-3 mb-1`}>
            {/* <div className={`${styles["bet-game-name"]} mt-1 mb-1`}>Sedie</div> */}
            <div className={`${styles["bet-choice-area"]} mt-1 mb-1`}>
                <div className={styles["bet-choice"]}>
                    <div>{choiceName}</div>
                </div>
                <div className={`${styles["bet-odds"]} `}>{odd || 0}</div>
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
