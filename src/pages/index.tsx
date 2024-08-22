import { useEffect, useState } from "react";
import Lobby from "../lobby/lobby";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { requestSSO } from "../_shared/utils/sso-helper";

const Demo = () => {
    const [token, setToken] = useState("");

    useEffect(() => {
        const call = async () => {
            const result = await requestSSO();
            setToken(result?.token);
        };
        call();
    }, []);

    return (
        <Container className="mt-3">
            <Lobby token={token} />
        </Container>
    );
};

export default Demo;
