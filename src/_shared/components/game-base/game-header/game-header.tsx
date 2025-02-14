import React from "react";
import styles from "../../../../lobby/lobby.module.scss";
import GameTitle from "./game-title";

export interface GameHeaderProps {
    gameId: number;
    arrowProps?: {
        className?: string;
        onClick?: (e: React.MouseEvent) => void;
    };
    centerTextsComponent?: React.ReactNode;
}

export abstract class GameHeader extends React.Component<GameHeaderProps> {
    render() {
        const { arrowProps, centerTextsComponent, gameId } = this.props;

        return (
            <div className={styles["game-title"]}>
                <GameTitle gameId={gameId} arrowProps={arrowProps} />
                {centerTextsComponent}
            </div>
        );
    }
}

export default GameHeader; 