import React from 'react';
import { GameHeader } from "../../../_shared/components/game-base/gateway-gamebase";
import { GameHeaderProps } from "../../../_shared/components/game-base/game-header/game-header";
import styles from "../../../lobby/lobby.module.scss";
import classNames from "classnames";
import GameHeaderCenterTexts from "../../../_shared/components/game-base/game-header/game-header-center-texts";

interface IBaccaratHeaderProps extends Omit<GameHeaderProps, 'centerTextsComponent'> {
    namespace: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    gameId: number;
}

const Header: React.FC<IBaccaratHeaderProps> = ({ isExpanded = true, onToggleExpand, ...props }) => {
    return (
        <GameHeader
            {...props}
            centerTextsComponent={<GameHeaderCenterTexts texts={["Player", "Banker", "Tie"]} />}
            arrowProps={{
                className: classNames(styles["arrow-icon"], { [styles.collapsed]: !isExpanded }),
                onClick: onToggleExpand
            }}
        />
    );
};

export default Header; 