import React from 'react';

interface GridLayoutProps {
    data: any[];
    renderItem: (props: any) => React.ReactNode;
}

export const GridLayout: React.FC<GridLayoutProps> = ({ data, renderItem }) => {
    return (
        <div className="grid-layout">
            {data.map((item, index) => (
                <div key={index} className="grid-item">
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
}; 