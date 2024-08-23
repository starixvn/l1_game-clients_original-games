import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import "reflect-metadata";
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
                query: { token: result?.token, ref: "d_direct" },
            });
        };
        call();
    }, []);

    return (
        <div data-react="true">
            <Container className="mt-3">
                <Lobby token={token} />
            </Container>
        </div>
    );
};

export default Demo;
