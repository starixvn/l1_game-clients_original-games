import { observer } from "observer";
import GameBase, { IGameBaseState } from "../../components/game-base";
import { GameBaseProps } from "../../components/game-base/type";
import { settings } from "./game-settings";

//configGameContainer(settings.name, containerOptions, siteConfigs);

@observer(settings.name)
export default class BigSmall extends GameBase<GameBaseProps, IGameBaseState> {
    constructor(props: any) {
        super(props);
    }

    getRenderTemplate() {
        return <>BigSmall Game....</>;
    }
}
