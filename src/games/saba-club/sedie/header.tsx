import React from "react";
import { setting } from "./game-settings";
import { GameHeader, GameHeaderProps } from "../../../_shared/components/game-base/gateway-gamebase";

class SeDieHeader extends GameHeader {
    protected getGameId(): number {
        return setting.id;
    }
}

const Header: React.FC<GameHeaderProps> = (props) => {
    return (
        <SeDieHeader
            {...props}
            gameIconPath="/static/images/game-icons/sedie.png"
            centerTexts={["Odd/Even", "Red/White"]}
        />
    );
};

export default Header;
