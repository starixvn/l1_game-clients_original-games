import "bootstrap/dist/css/bootstrap.min.css";
import i18next from "i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { I18nextProvider } from "react-i18next";
import "reflect-metadata";
import { requestSSO } from "../_shared/utils/sso-helper";
import "../lobby/lobby";
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

    const handleGetToken = () => {
        const call = async () => {
            const result = await requestSSO();
            setToken(result?.token);
            router.push({
                pathname: router.pathname,
                query: { token: result?.token, ref: "d_direct" },
            });
        };

        call();
    };

    useEffect(() => {
        const call = async () => {
            const result = await requestSSO();
            setToken(result?.token);
        };
        call();
    }, []);

    if (!router.isReady) {
        return <></>;
    }

    return (
        <I18nextProvider i18n={i18next}>
            <div data-react="true">
                <Container className="mt-3">
                    <Button variant="primary" onClick={handleGetToken}>
                        Get Token
                    </Button>
                    <div>
                        <Link href={`/?token=${token}&ref=d_direct`}>Demo page: {`/?token=${token}&ref=d_direct`} </Link>
                    </div>
                </Container>
            </div>
        </I18nextProvider>
    );
};

export default Index;
