import React, { useContext } from "react";

export type GameBettingZoneContextProps = {
    choice?: string;
    odd?: any;
    onHide?: any;
    show?: boolean;
};

export const GameBettingZoneContext = React.createContext<GameBettingZoneContextProps>({});
GameBettingZoneContext.displayName = "GameBettingZoneContext";

export const GameBettingZoneContextProvider = GameBettingZoneContext.Provider;
export const GameBettingZoneContextConsumer = GameBettingZoneContext.Consumer;
export const useGameBettingZoneContext = () => useContext(GameBettingZoneContext);
