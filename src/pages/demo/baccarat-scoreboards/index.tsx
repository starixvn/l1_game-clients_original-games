import React from 'react';
import { BaccaratBigRoadDemo } from './baccarat-scoreboards-demo';

const BaccaratScoreboardsDemo: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <BaccaratBigRoadDemo
                gameName="Baccarat"
            />
        </div>
    );
};

export default BaccaratScoreboardsDemo;