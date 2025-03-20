import Styles from './main-area.module.scss';
import { useState, useEffect } from 'react';

const COLLAPSED_WIDTH = '3.75rem';
const EXPANDED_WIDTH = '244px';

interface SidebarState {
    width: string;
    isOpen: boolean;
    toggle: () => void;
}

const useSidebar = (initialState = false): SidebarState => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [width, setWidth] = useState(COLLAPSED_WIDTH);

    useEffect(() => {
        setWidth(isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH);
    }, [isOpen]);

    return {
        width,
        isOpen,
        toggle: () => setIsOpen(!isOpen),
    };
};

interface SidebarProps {
    width: string;
    onToggle: () => void;
    position: 'left' | 'right';
}

const Sidebar: React.FC<SidebarProps> = ({ width, onToggle, position }) => (
    <div className={Styles[`${position}-bar`]} style={{ [`--${position}-width`]: width } as React.CSSProperties}>
        <button onClick={onToggle}>{position === 'left' ? '◀ Toggle Left' : 'Toggle Right ▶'}</button>
    </div>
);

interface MainAreaProps {
    children: React.ReactNode;
}

export const MainArea: React.FC<MainAreaProps> = ({ children }) => {
    const leftSidebar = useSidebar();
    const rightSidebar = useSidebar();

    return (
        <div className={Styles['main-container']}>
            <Sidebar position="left" width={leftSidebar.width} onToggle={leftSidebar.toggle} />
            <div className={Styles['main-area']}>{children}</div>
            <Sidebar position="right" width={rightSidebar.width} onToggle={rightSidebar.toggle} />
        </div>
    );
};
