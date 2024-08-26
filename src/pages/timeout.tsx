import i18next from "i18next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "reflect-metadata";

import common_en from "../translations/en/common.json";
import common_vi from "../translations/vi/common.json";

i18next.init({
    interpolation: { escapeValue: false }, // React already does escaping
    lng: "en", // language to use
    resources: {
        en: {
            common: common_en,
        },
        vi: {
            common: common_vi,
        },
    },
});

const TimeOut = () => {
    const { t } = useTranslation();
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
