import { observer } from "observer";
import GameBase from "../../components/game-base";
import { startGame } from "../../components/game-base/startup";
import { containerOptions, settings, siteConfigs } from "./game-settings";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
@observer("SeDie")
export default class SeDie extends GameBase<any> {
    constructor(props: any) {
        super(props);
    }

    getRenderTemplate() {
        return <>SeDie Game....</>;
    }
}
