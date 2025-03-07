import React from 'react';
import { BaccaratScoreboard } from '../../../games/saba-club/baccarat/scoreboard/ver1/baccarat-scoreboard';

const BaccaratBigRoadDemo1: React.FC = () => {
    return (
        <div style={{

            padding: '20px',
            minHeight: '100vh'
        }}>
            <h1 style={{ color: 'white', marginBottom: '20px' }}>Baccarat Big Road Demo 1</h1>
            <BaccaratScoreboard
                gameName="Baccarat"
                maxRows={6}
                namespace="Baccarat"
            />
        </div>
    );
};

export default BaccaratBigRoadDemo1;
