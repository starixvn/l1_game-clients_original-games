import * as gc from '@sg/sg-game-client';
import { handle, observer, render } from '@sg/sg-observer';
import { PureComponent } from 'react';

// interface TimeOutContainerProps {
//     router: Router;
// }

@observer
class TimeOutContainer extends PureComponent<any> {
    constructor(props: any) {
        super(props);
    }

    @render(gc.App.AppStore, (store) => store.isSessionTimeout)
    redirectToSessionTimeoutPage(isSessionTimeout: boolean) {
        const { router } = this.props;
        if (isSessionTimeout) {
            this.clearRecheckInInterval();
            router.push('timeout');
        }
    }

    @handle(gc.Auth.AuthHandlers.ClearRecheckInInterval)
    clearRecheckInInterval() {}

    render() {
        return <></>;
    }
}

export default TimeOutContainer;
// export default withRouter(TimeOutContainer);
