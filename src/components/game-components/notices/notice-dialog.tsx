import * as gc from "@sg/sg-game-client";
import BaseDialog from "../base-dialog";

export const NoticeDialog: React.FC<gc.Notices.Notice> = (props) => {
    return (
        <BaseDialog {...props}>
            <div className={`red-color`}>{props?.message}</div>
        </BaseDialog>
    );
};
