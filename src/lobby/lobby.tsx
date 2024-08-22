import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LiveGame from "../live-game/LiveGame";

export interface LobbyProps {
    token: string;
}

const Lobby = (props: LobbyProps) => {
    console.log("lobby props", props);
    return (
        <Tabs defaultActiveKey="sedie" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="sedie" title="Sedie">
                <LiveGame />
                Sedie Game
            </Tab>
            <Tab eventKey="bigsmall" title="Big Small">
                <LiveGame />
                Big Small Game
            </Tab>
        </Tabs>
    );
};

export default Lobby;
