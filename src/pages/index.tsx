import i18next from "i18next";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import { I18nextProvider } from "react-i18next";
import { usePWAWoker } from "../_shared/react-contexts/react-hooks/use-pwa-worker";
import Lobby from "../lobby/lobby";
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

const Demo = () => {
    usePWAWoker();
    const router = useRouter();

    if (!router?.isReady || typeof window === "undefined") {
        return <div></div>;
    }

    return (
        <I18nextProvider i18n={i18next}>
            <div data-react="true">
                <Container className="mt-3">
                    <Lobby />
                </Container>
            </div>
        </I18nextProvider>
    );
};

export default Demo;
