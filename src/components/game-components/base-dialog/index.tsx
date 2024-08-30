import * as gc from "@sg/sg-game-client";
import React, { useRef } from "react";

import { Button, Modal } from "react-bootstrap";
import Styles from "./base-dialog.module.scss";

export type Props = {
    title?: string;
    isOpen?: boolean;
    onClose?: any;
    children: React.ReactNode;
    type?: gc.Notices.NoticeType;
    showBtnConfirmButton?: boolean;
    noticeInfo?: gc.Notices.NoticeInfo;
};

const BaseDialog: React.FC<Props> = ({ title, children, onClose, isOpen, type, showBtnConfirmButton }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isError = type === gc.Notices.NoticeType.Error;
    const isInfo = type === gc.Notices.NoticeType.Info;
    const classType = isError ? Styles["error"] : Styles["warning"];
    const bgInfoClass = isInfo ? Styles["bg-info"] : Styles["bg-error"];

    return (
        <div ref={wrapperRef}>
            <Modal
                className={`${Styles["popup"]} ${classType}`}
                show={true}
                onHide={onClose?.()}
                animation={true}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <div className={bgInfoClass}>
                    {isError && (
                        <Modal.Header className={`${Styles["d-border"]}`} closeButton>
                            <Modal.Title className={Styles["d-title"]} id="contained-modal-title-vcenter">
                                {title}
                            </Modal.Title>
                        </Modal.Header>
                    )}

                    <Modal.Body>{children}</Modal.Body>
                    {isError && showBtnConfirmButton && (
                        <Modal.Footer className="justify-content-center">
                            <Button className="btn-warning" onClick={onClose?.()}>
                                OK
                            </Button>
                        </Modal.Footer>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default BaseDialog;
