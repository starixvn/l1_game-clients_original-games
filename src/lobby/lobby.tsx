import gc from "@sg/sg-game-client";
import mobx from "mobx";
import * as Observer from "observer";
import { useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { getSiteConfig } from "../_shared/app-settings";
import { getSharedContainer } from "../components/game-base/startup";
import LiveGame from "../live-game/LiveGame";

export interface LobbyProps {
    token: string;
}

export const DefaultTabGameId = 2;

console.log("Observer", Observer);

const Lobby = (props: LobbyProps) => {
    useEffect(() => {
        const sharedContainer = getSharedContainer(getSiteConfig(DefaultTabGameId));
        console.log("sharedContainer", sharedContainer);
        Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });
    }, []);

    console.log("lobby props", props);
    return (
        <Tabs defaultActiveKey="sedie" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="sedie" title="Sedie" unmountOnExit={true}>
                <LiveGame gameId={2} />
                Sedie Game
            </Tab>
            <Tab eventKey="bigsmall" title="Big Small" unmountOnExit={true}>
                <LiveGame gameId={1} />
                Big Small Game
            </Tab>
        </Tabs>
    );
};

export default Lobby;
