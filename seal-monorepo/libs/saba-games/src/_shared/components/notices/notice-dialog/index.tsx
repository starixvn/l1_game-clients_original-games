import * as gc from '@sg/sg-game-client';
import React, { useRef } from 'react';
import Styles from './notice-dialog.module.scss';

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
    const classType = isError ? Styles['error'] : Styles['warning'];
    const bgInfoClass = isInfo ? Styles['bg-info'] : Styles['bg-error'];

    return (
        <div ref={wrapperRef}>
            <div className={`${Styles['notice-container']} ${classType}`}>
                <div className={bgInfoClass}>
                    {/* <div className={`justify-content-between ${bgInfoClass}`}>
                        <strong className={Styles['d-title']}> {title}</strong>
                    </div> */}

                    <div>
                        {children}
                        {/* {showBtnConfirmButton && (
                            <div className='text-center'>
                                <div className='btn-warning' onClick={onClose}>
                                    OK
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeDialog;
