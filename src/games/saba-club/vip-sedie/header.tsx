import React from "react";
import { setting } from "./game-settings";
import { GameHeader, GameHeaderProps } from "../../../_shared/components/game-base/gateway-gamebase";
import styles from "../../../lobby/lobby.module.scss";
import classNames from "classnames";

class VIPSeDieHeader extends GameHeader {
    protected getGameId(): number {
        return setting.id;
    }
}

export interface VIPSeDieHeaderProps extends GameHeaderProps {
    namespace: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

const Header: React.FC<VIPSeDieHeaderProps> = ({ isExpanded = true, onToggleExpand, ...props }) => {
    return (
        <VIPSeDieHeader
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