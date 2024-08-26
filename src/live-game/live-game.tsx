import { useEffect, useState } from "react";
import { requestSSO } from "../_shared/utils/sso-helper";
import styles from "./live-game.module.scss";
import { useTranslation } from "react-i18next";

export interface LiveGameProps {
    gameId: number;
}

const LiveGame = (props: LiveGameProps) => {
    const { t } = useTranslation("common");
    const [url, setUrl] = useState("");

    useEffect(() => {
        const call = async () => {
            const result = await requestSSO(props.gameId);
            setUrl(result?.redirectUrl);
        };
        //call();
    }, []);

    const showIframe = url !== "";
    return (
        <div className={styles["live-game-container"]}>
            {showIframe && <iframe src={url} width={800} height={500} />}
            {!showIframe && <div className={styles["live-game"]}>{t("live_game")}</div>}
        </div>
    );
};

export default LiveGame;
