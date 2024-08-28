import { observer } from "observer";
import React from "react";
import GameBase from "../../components/game-base";
import { startGame } from "../../components/game-base/startup";
import SeDieBetOptions from "./bet-options";
import { containerOptions, settings, siteConfigs } from "./game-settings";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

@observer("SeDie")
export default class SeDie extends GameBase<any> {
    constructor(props: any) {
        super(props);
    }

    getRenderTemplate() {
        return (
            <React.Fragment>
                SeDie Game.....
                <span>ok</span>
                <SeDieBetOptions namespace="SeDie" />
            </React.Fragment>
        );
    }
}
