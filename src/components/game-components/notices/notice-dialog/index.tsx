import * as gc from "@sg/sg-game-client";
import React, { useRef } from "react";

import { Button, Toast } from "react-bootstrap";
import Styles from "./notice-dialog.module.scss";

export type Props = {
    title?: string;
    onClose?: any;
    children: React.ReactNode;
    type?: gc.Notices.NoticeType;
    showBtnConfirmButton?: boolean;
};

const NoticeDialog: React.FC<Props> = ({ title, children, onClose, type, showBtnConfirmButton }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isError = type === gc.Notices.NoticeType.Error;
    const isInfo = type === gc.Notices.NoticeType.Info;
    const classType = isError ? Styles["error"] : Styles["warning"];
    const bgInfoClass = isInfo ? Styles["bg-info"] : Styles["bg-error"];

    return (
        <div ref={wrapperRef}>
            <Toast className={`${Styles["notice-container"]} ${classType}`} show={true} onClose={onClose?.()}>
                <div className={bgInfoClass}>
                    <Toast.Header className={`justify-content-between ${bgInfoClass}`}>
                        <strong className={Styles["d-title"]}> {title}</strong>
                    </Toast.Header>

                    <Toast.Body>
                        {children}
                        {showBtnConfirmButton && (
                            <div className="text-center">
                                <Button className="btn-warning" onClick={onClose?.()}>
                                    OK
                                </Button>
                            </div>
                        )}
                    </Toast.Body>
                </div>
            </Toast>
        </div>
    );
};

export default NoticeDialog;
