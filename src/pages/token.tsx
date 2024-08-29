import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { requestSSO } from "../_shared/utils/sso-helper";

const Index = () => {
    const router = useRouter();
    const [token, setToken] = useState("");

    const handleGetToken = () => {
        const call = async () => {
            const result = await requestSSO();
            setToken(result?.token);
            router.push({
                pathname: router.pathname,
                query: { token: result?.token, ref: "d_direct" },
            });
        };

        call();
    };

    useEffect(() => {
        const call = async () => {
            const result = await requestSSO();
            setToken(result?.token);
        };
        call();
    }, []);

    if (!router.isReady) {
        return <></>;
    }

    return (
        <div data-react="true">
            <Container className="mt-3">
                <Button variant="primary" onClick={handleGetToken}>
                    Get Token
                </Button>
                <div>
                    <Link href={`/?token=${token}&ref=d_direct`}>Demo page: {`/?token=${token}&ref=d_direct`} </Link>
                </div>
            </Container>
        </div>
    );
};

export default Index;
