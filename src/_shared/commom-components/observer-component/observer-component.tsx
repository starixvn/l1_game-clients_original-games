import { useObserver } from "observer";
import React from "react";

export class ObserverComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            namespace: "",
            dispose: null,
        };
    }

    componentDidMount(): void {
        const { namespace } = this.state;
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
