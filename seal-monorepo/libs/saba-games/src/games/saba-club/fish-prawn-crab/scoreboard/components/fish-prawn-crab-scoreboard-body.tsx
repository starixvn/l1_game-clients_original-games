import React from 'react';
import { ScoreboardItemContent } from '../../../../../_shared/components/scoreboard/types';
import styles from '../fish-prawn-crab-scoreboard.module.scss';

type Props = {
    gameName: string;
    rows: string[][];
    scoreboardCharacter: ScoreboardItemContent;
    scoreboardDotClassName: ScoreboardItemContent;
};

export default function FishPrawnCrabScoreBoardBody({
    rows,
    scoreboardDotClassName
}: Props) {
    const maxColumns = Math.max(...rows.map((row) => row.length));
    const gridStyle = {
        gridTemplateColumns: `repeat(${maxColumns}, minmax(32px, 1fr))`,
        gridTemplateRows: `repeat(${rows.length}, minmax(32px, 1fr))`,
    };

    return (
        <div className={styles['scoreboard-grid']} style={gridStyle}>
            {rows.map((row, rowIndex) => {
                return row.map((item, colIndex) => {
                    let dotClass = '';
                    if (item === 'fish') dotClass = scoreboardDotClassName.positiveItemContent;
                    else if (item === 'crab') dotClass = scoreboardDotClassName.negativeItemContent;
                    else if (item === 'prawn') dotClass = 'dot-prawn';
                    else if (item === 'rooster') dotClass = 'dot-rooster';
                    else if (item === 'gourd') dotClass = 'dot-gourd';
                    else if (item === 'coin') dotClass = 'dot-coin';
                    else if (item === 'b') dotClass = 'dot-blink';

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={styles['dot-item']}
                            style={{ gridRow: rowIndex + 1, gridColumn: colIndex + 1 }}
                        >
                            {item && (
                                <div className={styles[dotClass]}>
                                    {/* You can render a symbol or letter here if needed */}
                                </div>
                            )}
                        </div>
                    );
                });
            })}
        </div>
    );
} 