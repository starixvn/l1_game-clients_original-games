import React from 'react';
import RNGSoccer from '../games/saba-club/rng-soccer';
import { Page as CoinTossPage } from '../games/saba-club/coin-toss';

const MainPage = () => {
    return (
        <div>
            {/* <RNGSoccer namespace="RNGSoccer" language="en" /> */}
            <CoinTossPage namespace="CoinToss" language="en" />
        </div>
    );
};

export default MainPage; 