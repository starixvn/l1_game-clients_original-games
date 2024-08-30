import * as gc from "@sg/sg-game-client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TimeOut = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }

    return (
        <div className="error-page">
            <img alt="SessionTimeout" className="error-background" src={`/static/images/error-session-light.svg`} />
            <p className="session-timeout-title">
                {gc.Translator.t("Common.message_session_timeout_break")} <br />
            </p>
        </div>
    );
};

export default TimeOut;
