import React, { useRef } from "react";
import Toast from "react-bootstrap/Toast";

import Styles from "./warning.module.scss";

export type Props = {
    children: React.ReactNode;
};

const WarningDialog: React.FC<Props> = ({ children }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={wrapperRef}>
            <Toast className={Styles["warning-container"]}>
                <Toast.Body>{children}</Toast.Body>
            </Toast>
        </div>
    );
};

export default WarningDialog;
