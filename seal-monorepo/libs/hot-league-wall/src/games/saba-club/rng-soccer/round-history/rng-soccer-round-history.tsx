import React from 'react';
import { observer } from '@sg/sg-observer';
import { RNGSoccerRoundHistory } from '../type';

interface RNGSoccerRoundHistoryProps {
    namespace: string;
    language: string;
}

@observer
export default function RNGSoccerRoundHistory({ namespace, language }: RNGSoccerRoundHistoryProps) {
    return (
        <div className="round-history">
            {/* Add round history UI here */}
        </div>
    );
} 