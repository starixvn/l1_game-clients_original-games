import React from 'react';
import { observer } from '@sg/sg-observer';

interface RNGSoccerStatisticProps {
    namespace: string;
    language: string;
}

@observer
export default function RNGSoccerStatistic({ namespace, language }: RNGSoccerStatisticProps) {
    return (
        <div className="statistic">
            {/* Add statistic UI here */}
        </div>
    );
} 