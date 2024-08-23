import { useObserver } from "observer";
import React from "react";

export interface IPropsObserver {
    namespace: string;
}

export class ObserverComponent extends React.Component<IPropsObserver, { dispose: (() => void) | null }> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
        };
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
        return null;
    }
}
