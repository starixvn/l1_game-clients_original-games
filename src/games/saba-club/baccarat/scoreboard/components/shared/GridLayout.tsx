import React from 'react';
import styles from './GridLayout.module.scss';

interface GridLayoutProps<T> {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
}

export const GridLayout = <T,>({ data, renderItem }: GridLayoutProps<T>): React.ReactElement => {
    return (
        <div className={styles['grid-layout']}>
            {data.map((item, index) => (
                <div key={index} className={styles['grid-item']}>
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
}; 