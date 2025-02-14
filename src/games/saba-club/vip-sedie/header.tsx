import React from "react";
import { GameHeader } from "../../../_shared/components/game-base/gateway-gamebase";
import { GameHeaderProps } from "../../../_shared/components/game-base/game-header/game-header";
import styles from "../../../lobby/lobby.module.scss";
import classNames from "classnames";
import { GameHeaderCenterTexts } from "../../../_shared/components/game-base/game-header/game-header-center-texts";
export interface VIPSeDieHeaderProps extends GameHeaderProps {
    namespace: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

const Header: React.FC<VIPSeDieHeaderProps> = ({ isExpanded = true, onToggleExpand, ...props }) => {
    return (
        <GameHeader
            {...props}
            centerTextsComponent={<GameHeaderCenterTexts texts={["Odd/Even", "Red/White"]} />}
            arrowProps={{
                className: classNames(styles["arrow-icon"], { [styles.collapsed]: !isExpanded }),
                onClick: onToggleExpand
            }}
        />
    );
};

export default Header; 