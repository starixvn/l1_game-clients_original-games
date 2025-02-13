import React from "react";
import { setting } from "./game-settings";
import { GameHeader, GameHeaderProps } from "../../../_shared/components/game-base/gateway-gamebase";

class VipSeDieHeader extends GameHeader {
    protected getGameId(): number {
        return setting.id;
    }
}

const Header: React.FC<GameHeaderProps> = (props) => {
    return (
        <VipSeDieHeader
            {...props}
            gameIconPath="/static/images/game-icons/vip-sedie.png"
            centerTexts={["Odd/Even", "Red/White"]}
        />
    );
};

export default Header; 