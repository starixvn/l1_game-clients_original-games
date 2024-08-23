import React from "react";
import { locales } from "../../constants";

export type PlayerContextModel = {
    authorizeInfo?: any;
    session?: any;
    locale?: string;
    setBalance?: (balance: number) => void;
    signOut?: () => void;
};

export const PlayerContext = React.createContext<PlayerContextModel>({
    locale: locales.en,
});
PlayerContext.displayName = "AuthContext";

export const PlayerContextProvider = PlayerContext.Provider;
export const PlayerContextConsumer = PlayerContext.Consumer;
export const usePlayerContext = () => React.useContext(PlayerContext);
