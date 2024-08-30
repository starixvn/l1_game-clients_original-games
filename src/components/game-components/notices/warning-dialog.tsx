import * as gc from "@sg/sg-game-client";
import BaseDialog from "../base-dialog";

export const WarningDialog: React.FC<gc.Notices.Warning> = (props) => {
    return (
        <BaseDialog {...props}>
            <div className={`red-color`}>{props?.message}</div>
        </BaseDialog>
    );
};
