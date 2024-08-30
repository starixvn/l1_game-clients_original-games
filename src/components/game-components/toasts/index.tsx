import React, { useRef } from "react";
import Toast from "react-bootstrap/Toast";

import Styles from "./toasts.module.scss";

export type Props = {
    children: React.ReactNode;
};

const BaseToasts: React.FC<Props> = ({ children }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={wrapperRef}>
            <Toast className={Styles["toast-container"]}>
                <Toast.Body>{children}</Toast.Body>
            </Toast>
        </div>
    );
};

export default BaseToasts;
