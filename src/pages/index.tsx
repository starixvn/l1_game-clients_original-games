import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import "reflect-metadata";
import { requestSSO } from "../_shared/utils/sso-helper";
import Lobby from "../lobby/lobby";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
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

const Index = () => {
    const router = useRouter();
    const [token, setToken] = useState("");

    useEffect(() => {
        const call = async () => {
            const result = await requestSSO();
            setToken(result?.token);
            router.push({
                pathname: router.pathname,
                query: { token: result?.token, ref: "d_direct" },
            });
        };
        call();
    }, []);

    return (
        <I18nextProvider i18n={i18next}>
            <div data-react="true">
                <Container className="mt-3">
                    <Lobby token={token} />
                </Container>
            </div>
        </I18nextProvider>
    );
};

export default Index;
