import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

const Error = () => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        setIsLoading(false);
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }

    return (
        <div>
            <div className="error-page">
                <img className="error-background small" src={`/static/images/error-${theme}.svg`} alt="error" />
                <p className="info">An error has occurred, please contact CSD for details</p>
            </div>
        </div>
    );
};

export default Error;
