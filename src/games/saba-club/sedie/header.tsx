import React from "react";
import { GameHeader } from "../../../_shared/components/game-base/gateway-gamebase";
import { GameHeaderProps } from "../../../_shared/components/game-base/game-header";
import styles from "../../../lobby/lobby.module.scss";
import classNames from "classnames";

interface SeDieHeaderProps extends GameHeaderProps {
    namespace: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

const Header: React.FC<SeDieHeaderProps> = ({ isExpanded = true, onToggleExpand, ...props }) => {
    return (
        <GameHeader
            {...props}
            centerTexts={["Odd/Even", "Red/White"]}
            arrowProps={{
                className: classNames(styles["arrow-icon"], { [styles.collapsed]: !isExpanded }),
                onClick: onToggleExpand
            }}
        />
    );
};

export default Header;
