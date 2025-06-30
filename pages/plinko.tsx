import React from 'react';
import dynamic from 'next/dynamic';
import '../src/styles/plinko/plinko.scss';

// Dynamically import the PlinkoGamePage with SSR disabled
const PlinkoGamePage = dynamic(() => import('../src/games/plinko').then(mod => ({ default: mod.PlinkoGamePage })), {
    ssr: false,
    loading: () => <div>Loading Plinko Game...</div>
});

const PlinkoPage = () => {
    return (
        <div className="plinko-page">
            <PlinkoGamePage />
        </div>
    );
};

export default PlinkoPage; 