import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TimeOut = () => {
    const { t } = useTranslation("common");
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
                {t("sessionTimeout-1")} <br />
                {t("sessionTimeout-2")}
            </p>
        </div>
    );
};

export default TimeOut;
