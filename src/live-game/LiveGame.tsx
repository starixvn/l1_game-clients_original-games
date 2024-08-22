import { useEffect, useState } from "react";
import { requestSSO } from "../_shared/utils/sso-helper";

export interface LiveGameProps {
    gameId: number;
}

const LiveGame = (props: LiveGameProps) => {
    const [url, setUrl] = useState("");

    useEffect(() => {
        const call = async () => {
            const result = await requestSSO(props.gameId);
            setUrl(result?.redirectUrl);
        };
        call();
    }, []);

    return (
        <div>
            <iframe src={url} width={800} height={500} />
        </div>
    );
};

export default LiveGame;
