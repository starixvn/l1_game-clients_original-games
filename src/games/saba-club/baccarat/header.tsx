import React from 'react';
import { GameHeader } from "../../../_shared/components/game-base/gateway-gamebase";
import { GameHeaderProps } from "../../../_shared/components/game-base/game-header/game-header";
import GameHeaderCenterTexts from "../../../_shared/components/game-base/game-header/game-header-center-texts";

interface IBaccaratHeaderProps extends Omit<GameHeaderProps, 'centerTextsComponent'> {
    namespace: string;
}

const Header: React.FC<IBaccaratHeaderProps> = (props) => {
    return (
        <GameHeader
            {...props}
            centerTextsComponent={<GameHeaderCenterTexts texts={["Player/Banker", "Tie", "Pair"]} />}
        />
    );
};

export default Header; 