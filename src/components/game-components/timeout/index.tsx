import * as gc from "@sg/sg-game-client";
import { withRouter } from "next/router";
import { observer, render } from "observer";
import { Component } from "react";

@observer
class TimeOutContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    @render(gc.App.AppStore, (store) => ({ isSessionTimeout: store.isSessionTimeout, isApp: store.isApp }))
    redirectToSessionTimeoutPage({ isSessionTimeout, isApp }: { isSessionTimeout: boolean; isApp: boolean }) {
        const { router } = this.props;
        if (isSessionTimeout) {
            router.push("timeout");
        }
    }

    render() {
        return <div></div>;
    }
}

export default withRouter(TimeOutContainer);
