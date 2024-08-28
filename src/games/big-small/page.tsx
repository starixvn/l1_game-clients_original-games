import { observer } from "observer";
import GameBase from "../../components/game-base";
import { settings } from "./game-settings";

// startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
@observer(settings.name)
export default class BigSmall extends GameBase<any> {
    constructor(props: any) {
        super(props);
    }

    getRenderTemplate() {
        return <>BigSmall Game....</>;
    }
}
