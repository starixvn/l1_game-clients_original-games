import React from 'react';
import FishPrawnCrabDice, { FishPrawnCrabSymbol, diceValueToSymbol } from './index';
import { Size } from '../../../_shared/constants';

const FishPrawnCrabDiceDemo: React.FC = () => {
    const allSymbols = [
        FishPrawnCrabSymbol.STAG,
        FishPrawnCrabSymbol.GOURD,
        FishPrawnCrabSymbol.ROOSTER,
        FishPrawnCrabSymbol.FISH,
        FishPrawnCrabSymbol.CRAB,
        FishPrawnCrabSymbol.PRAWN,
        FishPrawnCrabSymbol.EMPTY
    ];

    const allSizes = [Size.large, Size.medium, Size.small];

    // Example dice values from 1-6
    const exampleDiceValues = [1, 2, 3, 4, 5, 6];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Fish Prawn Crab Dice Demo</h2>

            <h3>All Symbols</h3>
            {allSizes.map(size => (
                <div key={size} style={{ marginBottom: '20px' }}>
                    <h4>Size: {size}</h4>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {allSymbols.map(symbol => (
                            <div key={symbol} style={{ textAlign: 'center', margin: '10px' }}>
                                <FishPrawnCrabDice symbol={symbol} size={size} />
                                <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                    {FishPrawnCrabSymbol[symbol]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <h3>Dice Value Conversion Example</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {exampleDiceValues.map(value => {
                    const symbol = diceValueToSymbol(value);
                    return (
                        <div key={value} style={{ textAlign: 'center', margin: '10px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                                Dice Value: {value}
                            </div>
                            <FishPrawnCrabDice symbol={symbol} />
                            <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                {FishPrawnCrabSymbol[symbol]}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FishPrawnCrabDiceDemo; 