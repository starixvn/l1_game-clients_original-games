import { observer } from "observer";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { CountDownTimer, RoundId } from "../../components";
import GameBase from "../../components/game-base";
import { startGame } from "../../components/game-base/startup";
import SeDieBetOptions from "./bet-options";
import { containerOptions, settings, siteConfigs } from "./game-settings";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
@observer(settings.name)
export default class SeDie extends GameBase<any> {
    constructor(props: any) {
        super(props);
    }

    getRenderTemplate() {
        return (
            <React.Fragment>
                SeDie Game.....
                <Container>
                    <Row>
                        <Col>
                            <RoundId namespace={settings.name} />
                        </Col>
                        <Col>
                            <CountDownTimer namespace={settings.name} />
                        </Col>
                    </Row>
                    <Row>
                        <SeDieBetOptions namespace={settings.name} />
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
