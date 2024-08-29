import { FC, ReactNode, useState } from "react";
import {
    GameBettingZoneContext,
    GameBettingZoneContextProps,
} from "../../../_shared/react-contexts/game-betting-zone-context/game-betting-zone-context";
import BetPanelComponent from "../bet-panel/bet-panel";
import Styles from "./bet-option.module.scss";

export interface IBettingBlockProps {
    children: ReactNode;
    choice: string;
    odd: number;
    namespace: string;
}

const BettingBlock: FC<IBettingBlockProps> = ({ children, choice, odd, namespace }) => {
    const onHide = () => {
        setBettingZoneState((prevState) => ({ ...prevState, show: false }));
    };

    const [bettingZoneState, setBettingZoneState] = useState<GameBettingZoneContextProps>({
        choice: "",
        odd: 0,
        onHide: onHide,
        show: false,
    });

    const handleOnClick = () => {
        setBettingZoneState((prevState) => ({ ...prevState, choice, odd, show: !prevState.show }));
    };

    return (
        <GameBettingZoneContext.Provider value={bettingZoneState}>
            <div className={Styles["betting-block"]} onClick={handleOnClick}>
                {children}
            </div>
            <BetPanelComponent namespace={namespace} />
        </GameBettingZoneContext.Provider>
    );
};

export default BettingBlock;
