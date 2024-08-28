import { useObserver } from "observer";
import React from "react";

export interface IPropsObserver {
    namespace: string;
}
export interface IStatesObserver {
    dispose: (() => void) | null;
}

export class ObserverComponent<P extends IPropsObserver, S extends IStatesObserver> extends React.PureComponent<
    IPropsObserver,
    IStatesObserver
> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
        } as S;
    }

    componentDidMount(): void {
        const { namespace } = this.props;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const dispose = useObserver(this, namespace);
        this.setState({ dispose });
    }

    componentWillUnmount(): void {
        const { dispose } = this.state;
        dispose?.();
    }

    render() {
        return <></>;
    }
}
