import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import { usePWAWoker } from "../_shared/react-contexts/react-hooks/use-pwa-worker";
import Lobby from "../lobby/lobby";

const Demo = () => {
    usePWAWoker();
    const router = useRouter();

    if (!router?.isReady || typeof window === "undefined") {
        return <div></div>;
    }

    return (
        <div data-react="true">
            <Container className="mt-3">
                <Lobby />
            </Container>
        </div>
    );
};

export default Demo;
