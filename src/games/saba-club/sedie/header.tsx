import React from "react";
import { GameHeader } from "../../../_shared/components/game-base/gateway-gamebase";
import { GameHeaderProps } from "../../../_shared/components/game-base/game-header/game-header";
import GameHeaderCenterTexts from "../../../_shared/components/game-base/game-header/game-header-center-texts";

interface SeDieHeaderProps extends Omit<GameHeaderProps, 'centerTextsComponent'> {
    namespace: string;
}

const Header: React.FC<SeDieHeaderProps> = (props) => {
    return (
        <GameHeader
            {...props}
            centerTextsComponent={<GameHeaderCenterTexts texts={["Odd/Even", "Red/White"]} />}
        />
    );
};

export default Header;
