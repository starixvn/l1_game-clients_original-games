import * as gc from "@sg/sg-game-client";
import { observer, render } from "@sg/sg-observer";
import { Router, withRouter } from "next/router";
import { PureComponent } from "react";

interface TimeOutContainerProps {
    router: Router;
}

@observer
class TimeOutContainer extends PureComponent<TimeOutContainerProps> {
    constructor(props: any) {
        super(props);
    }

    @render(gc.App.AppStore, (store) => store.isSessionTimeout)
    redirectToSessionTimeoutPage(isSessionTimeout: boolean) {
        const { router } = this.props;
        if (isSessionTimeout) {
            router.push("timeout");
        }
    }

    render() {
        return <></>;
    }
}

export default withRouter(TimeOutContainer);
