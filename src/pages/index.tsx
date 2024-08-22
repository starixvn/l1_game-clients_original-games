import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { requestSSO } from "../_shared/utils/sso-helper";
import Lobby from "../lobby/lobby";

const Demo = () => {
    const router = useRouter();
    const [token, setToken] = useState("");

    useEffect(() => {
        const call = async () => {
            const result = await requestSSO();
            setToken(result?.token);
            router.push({
                pathname: router.pathname,
                query: { token: token },
            });
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
