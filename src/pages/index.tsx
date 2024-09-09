import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import TimeOutContainer from "../_shared/components/timeout";
import Lobby from "../lobby/lobby";

const Demo = () => {
    const router = useRouter();

    if (!router?.isReady || typeof window === "undefined") {
        return <div></div>;
    }

    return (
        <div data-react="true">
            <Container className="mt-3">
                <Lobby />
                <TimeOutContainer />
            </Container>
        </div>
    );
};

export default Demo;
