import { useObserver } from "@sg/sg-observer";
import React from "react";

export interface IPropsObserver {
    namespace: string;
}
export interface IStateObserver {
    dispose: (() => void) | null;
}

export class ObserverComponent<P extends IPropsObserver, S extends IStateObserver> extends React.PureComponent<P, S> {
    constructor(props: P) {
        super(props);
        console.log(`[ObserverComponent] Initializing with namespace: ${props.namespace}`);
        this.state = {
            dispose: null,
        } as S;
    }

    componentDidMount(): void {
        const { namespace } = this.props;
        console.log(`[ObserverComponent] Mounting component with namespace: ${namespace}`);

        if (!namespace) {
            console.error(`[ObserverComponent] No namespace provided`);
            return;
        }

        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const dispose = useObserver(this, namespace);
            if (!dispose) {
                throw new Error('Observer registration failed - no dispose function returned');
            }
            console.log(`[ObserverComponent] Successfully registered observer for namespace: ${namespace}`);
            this.setState({ dispose }, () => {
                console.log(`[ObserverComponent] Updated state with dispose function for namespace: ${namespace}`);
            });
        } catch (error) {
            console.error(`[ObserverComponent] Error registering observer for namespace: ${namespace}`, error);
            // Attempt to recover by retrying once after a short delay
            setTimeout(() => {
                try {
                    const dispose = useObserver(this, namespace);
                    if (dispose) {
                        this.setState({ dispose });
                        console.log(`[ObserverComponent] Successfully registered observer on retry for namespace: ${namespace}`);
                    }
                } catch (retryError) {
                    console.error(`[ObserverComponent] Retry failed for namespace: ${namespace}`, retryError);
                }
            }, 100);
        }
    }

    componentWillUnmount(): void {
        const { namespace } = this.props;
        const { dispose } = this.state;

        console.log(`[ObserverComponent] Unmounting component with namespace: ${namespace}`);
        if (dispose) {
            try {
                dispose();
                console.log(`[ObserverComponent] Successfully cleaned up observer for namespace: ${namespace}`);
            } catch (error) {
                console.error(`[ObserverComponent] Error cleaning up observer for namespace: ${namespace}`, error);
            }
        } else {
            console.warn(`[ObserverComponent] No dispose function found for namespace: ${namespace}`);
        }
    }

    render() {
        return <></>;
    }
}
