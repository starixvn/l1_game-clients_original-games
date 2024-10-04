import * as gc from "@sg/sg-game-client";
import { render } from "@sg/sg-observer";
import { IPropsObserver, IStateObserver, ObserverComponent } from "../../../_shared/components/observer-component/observer-component";
import NoticeDialog from "./notice-dialog";
import { FunctionUtils } from "../../utils/funtion-utils";

export interface INoticeState extends IStateObserver {
    notice: gc.Notices.Notice;
    isShow: boolean;
}

export default class Notice extends ObserverComponent<IPropsObserver, INoticeState> {
    constructor(props: IPropsObserver) {
        super(props);
        this.state = {
            dispose: null,
            notice: {},
            isShow: false,
        } as INoticeState;
    }

    @render(gc.Notices.NoticeStore, (store) => store.notice, { fireImmediately: false })
    setNotice(notice: gc.Notices.Notice) {
        !!notice && this.setState({ notice, isShow: true });
    }

    @render(gc.DisabledGame.DisabledGameStore, (store) => store.showPopup, { fireImmediately: false })
    setHideNotice(showPopup: boolean) {
        if (!showPopup && this.state.isShow) {
            this.setState({ isShow: false });
        }
    }

    closeNotice() {
        this.setState({ isShow: false });
    }

    render() {
        const { notice } = this.state;
        const onClose = FunctionUtils.isFunctionNotExistedOrEmpty(notice.onClose) ? this.closeNotice.bind(this) : notice.onClose;
        return this.state.isShow ? (
            <NoticeDialog {...this.state.notice} onClose={() => onClose}>
                <div>{this.state.notice?.message}</div>
            </NoticeDialog>
        ) : (
            <></>
        );
    }
}
