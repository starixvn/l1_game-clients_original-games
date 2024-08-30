import * as gc from "@sg/sg-game-client";
import { NextPageContext } from "next";
import NextErrorComponent from "next/error";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MyError = ({ statusCode, hasGetInitialPropsRun, err }: any) => {
    if (!hasGetInitialPropsRun && err) {
        gc.sentryLogger.logError(err);
    }

    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(false);
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }

    return (
        <div>
            <div className="error-page">
                <img className="error-background small" src={`/static/images/error-light.svg`} alt="error" />
                <p className="info">{gc.Translator.t("Common.message_error_occurred", { errorCode: statusCode }).replaceTolgeeFormat()}</p>
            </div>
        </div>
    );
};

MyError.getInitialProps = async (context: NextPageContext) => {
    const initialProps = await NextErrorComponent.getInitialProps(context);

    const errorInitialProps = {
        ...initialProps,
        hasGetInitialPropsRun: true,
    };

    context.err
        ? gc.sentryLogger.logError(context.err)
        : gc.sentryLogger.logError(new Error(`_error.js getInitialProps missing data at path: ${context.asPath}`));

    return errorInitialProps;
};

export default MyError;
