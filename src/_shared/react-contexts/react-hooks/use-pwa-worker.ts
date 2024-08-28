import { useEffect, useRef } from "react";

export function usePWAWoker() {
    const workerRef = useRef<any>(null);

    useEffect(() => {
        try {
            if (window.Worker) {
                workerRef.current = new Worker("/worker.js", { type: "module" });
                workerRef.current.onmessage = (evt: any) => workerRef.current.postMessage(evt.data);
            } else {
                console.log("Your browser doesn't support web workers.");
            }
        } catch (error) {
            console.log(error);
        }
        return () => {
            workerRef.current && workerRef.current.terminate();
        };
    }, []);

    return workerRef;
}
