import "bootstrap/dist/css/bootstrap.min.css";
import i18next from "i18next";
import { observer } from "observer";
import React from "react";
import Container from "react-bootstrap/Container";
import { I18nextProvider } from "react-i18next";
import "reflect-metadata";
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

@observer("default")
class Demo extends React.Component<any, any> {
    render() {
        const { token } = this.props;

        return (
            <I18nextProvider i18n={i18next}>
                <div data-react="true">
                    <Container className="mt-3">
                        <Lobby token={token} />
                    </Container>
                </div>
            </I18nextProvider>
        );
    }
}

export default Demo;
