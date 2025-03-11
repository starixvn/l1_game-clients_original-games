import * as gc from "@sg/sg-game-client";
import { NextRouter } from "next/router";
import { Tab } from "react-bootstrap";
import Image from "next/image";
import React from "react";
import { getGameSetting, getGameSettingIds } from "../_shared/app-settings";
import { BigSmall, SeDie, VipSeDie } from "../games/saba-club";
import { LuckyNext, SicBall } from "../games/saba-xD";
import styles from "./lobby.module.scss";
import classNames from "classnames";

// Initialize settings
const settingsSeDie = SeDie.Setting.setting;
const settingsBigSmall = BigSmall.Setting.setting;
const settingsSicBall = SicBall.Setting.setting;
const settingsLuckyNext = LuckyNext.Setting.setting;
const settingsVipSeDie = VipSeDie.Setting.setting;

const getGameById = (gameId: number, router: NextRouter) => {
    const games: { [x: number]: JSX.Element } = {
        [settingsSeDie.id]: <SeDie.Page router={router} namespace={settingsSeDie.mainObserverNamespace} />,
        [settingsBigSmall.id]: <BigSmall.Page router={router} namespace={settingsBigSmall.mainObserverNamespace} />,
        [settingsLuckyNext.id]: (
            <LuckyNext.Page
                router={router}
                namespace={settingsLuckyNext.mainObserverNamespace}
                overrideClasses={styles["lucky-next-block-wrapper"]}
            />
        ),
        [settingsSicBall.id]: <SicBall.Page router={router} namespace={settingsSicBall.mainObserverNamespace} />,
        [settingsVipSeDie.id]: <VipSeDie.Page router={router} namespace={settingsVipSeDie.mainObserverNamespace} />,
    };

    return games[gameId];
};

const getGameHeaderById = (gameId: number, isExpanded: boolean, onToggleExpand: (gameId: number) => void) => {
    const gameHeader = {
        [settingsSeDie.id]: <SeDie.Header />,
        [settingsBigSmall.id]: <BigSmall.Header />,
        [settingsLuckyNext.id]: <LuckyNext.Header />,
        [settingsSicBall.id]: <SicBall.Header />,
        [settingsVipSeDie.id]: <VipSeDie.Header />,
    };

    const header = gameHeader[gameId];
    if (!header) return null;

    // Clone the header element and add the click handler to its arrow icon
    return React.cloneElement(header, {
        arrowProps: {
            className: classNames(styles["arrow-icon"], { [styles.collapsed]: !isExpanded }),
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                onToggleExpand(gameId);
            }
        }
    });
};

const getFilteredGames = (
    offerGames: {
        gameId: number;
    }[]
) => {
    const gameSettingIds = getGameSettingIds();

    const filteredGames = gameSettingIds
        .filter((gameId) => {
            const found = offerGames.find((offerGame) => offerGame.gameId === gameId);
            return found;
        })
        .map((gameId) => {
            return { gameId };
        });

    return filteredGames;
};

const getGameIconPath = (gameId: number): string => {
    const iconMap: { [key: number]: string } = {
        [settingsSeDie.id]: "/static/images/game-icons/sedie.png",
        [settingsVipSeDie.id]: "/static/images/game-icons/vip-sedie.png",
        // Add other game icons here as they become available
    };
    return iconMap[gameId] || "";
};

const TabTitleWithIcon = ({ gameId, gameName }: { gameId: number; gameName: string }) => {
    const iconPath = getGameIconPath(gameId);

    return (
        <div className={styles["tab-title"]}>
            {iconPath && (
                <Image
                    src={iconPath}
                    alt={gameName}
                    width={32}
                    height={32}
                    className={styles["tab-icon"]}
                    priority
                />
            )}
            <span>{gameName}</span>
        </div>
    );
};

const getGameTabById = (
    gameId: number,
    router: NextRouter,
    isRenderGame: boolean,
    isExpanded: boolean,
    onToggleExpand: (gameId: number) => void
) => {
    const gameSetting = getGameSetting(gameId);
    if (!gameSetting) {
        return null;
    }

    const gameName = gc.Translator.t(`${gameSetting.gameName}.game_name`);
    const key = gameSetting.mainObserverNamespace;

    return (
        <Tab
            key={gameId}
            eventKey={gameId}
            title={<TabTitleWithIcon gameId={gameId} gameName={gameName} />}
            unmountOnExit={true}
        >
            {getGameHeaderById(gameId, isExpanded, onToggleExpand)}
            <div className={classNames(styles["game-lobby"], { [styles.collapsed]: !isExpanded })}>
                {isRenderGame && getGameById(gameId, router)}
            </div>
        </Tab>
    );
};

export { getFilteredGames, getGameHeaderById, getGameTabById };
