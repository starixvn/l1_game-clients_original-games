import * as gc from "@sg/sg-game-client";
import { render } from "observer";
import {
    IPropsObserver,
    IStateObserver,
    ObserverComponent,
} from "../../../_shared/commom-components/observer-component/observer-component";
import NoticeDialog from "./notice-dialog";

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
        this.setState({ notice, isShow: true });
    }

    @render(gc.DisabledGame.DisabledGameStore, (store) => store.showPopup, { fireImmediately: false })
    setHideNotice(showPopup: boolean) {
        if (!showPopup && this.state.isShow) {
            this.setState({ isShow: false });
        }
    }

    render() {
        return this.state.isShow ? (
            <NoticeDialog {...this.state.notice}>
                <div>{this.state.notice?.message}</div>
            </NoticeDialog>
        ) : (
            <></>
        );
    }
}
