import * as gc from "@sg/sg-game-client";
import BaseToasts from "../toasts";
import Styles from "./notice.module.scss";

export const WarningDialog: React.FC<gc.Notices.Warning> = (props) => {
    return (
        <BaseToasts {...props}>
            <div className={Styles["title-white"]}>{props?.message}</div>
        </BaseToasts>
    );
};
