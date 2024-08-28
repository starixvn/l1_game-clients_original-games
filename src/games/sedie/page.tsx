import { observer } from "observer";
import React from "react";
import GameBase from "../../components/game-base";
import SeDieBetOptions from "./bet-options";

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
