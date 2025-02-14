import * as gc from "@sg/sg-game-client";
import GameBase, { IGameBaseState } from ".";
import { GameBaseProps } from "./type";
import React from "react";
import Image from "next/image";
import styles from "../../../lobby/lobby.module.scss";
import { getGameSetting } from "../../app-settings";

import { handle, render } from "@sg/sg-observer";

export interface GameHeaderProps {
    arrowProps?: {
        className?: string;
        onClick?: (e: React.MouseEvent) => void;
    };
    centerTexts?: string[];
}

export abstract class GameHeader extends React.Component<GameHeaderProps> {
    render() {
        const { arrowProps, centerTexts = [] } = this.props;
        const gameSetting = getGameSetting(this.getGameId());
        const gameName = gc.Translator.t(`${gameSetting?.gameName}.game_name`);

        return (
            <div className={styles["game-title"]}>
                <div className={styles["title-with-icon"]}>
                    <Image
                        src="/static/images/lobby/arrow.png"
                        alt="Arrow Icon"
                        width={24}
                        height={24}
                        {...arrowProps}
                        priority
                    />
                    <span className={styles.divider} />
                    <Image
                        src={`/static/images/game-icons/game-icon-${this.getGameId()}.png`}
                        alt="Game Icon"
                        width={32}
                        height={32}
                        className={styles["game-icon"]}
                        priority
                    />
                    <div>{gameName}</div>
                </div>
                {centerTexts.map((text, index) => (
                    <div key={index} className={styles["game-title-text-center"]}>
                        {text}
                    </div>
                ))}
            </div>
        );
    }

    protected abstract getGameId(): number;
}

export default abstract class GatewayGameBase<P extends GameBaseProps, S extends IGameBaseState> extends GameBase<P, S> {
    protected isJoinGame = false;

    componentDidMount() {
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.connectLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler, (handler) => handler.handleGateway())
    connectLiveGateway() { }

    @render(gc.Connection.ConnectionStore, (store) => store.isConnected)
    handleJoinGame(isConnected: boolean) {
        if (isConnected) {
            !this.isJoinGame && this.joinGame();
        }
    }

    @handle(gc.Connection.ConnectionHandlers.JoinGameHandler)
    joinGame() {
        this.isJoinGame = true;
    }

    @handle(gc.Connection.ConnectionHandlers.SignInHandler)
    signIn() { }

    override handleConnected(signedIn: boolean) {
        signedIn && this.inGameLiveGateway();
    }

    @handle(gc.Connection.ConnectionHandlers.InGameHandler, (handler) => handler.handleGateway())
    inGameLiveGateway() { }
}
