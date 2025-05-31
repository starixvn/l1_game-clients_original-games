import React from 'react';
import styles from '../rng-soccer-scoreboard.module.scss';
// Image assets
import homeDotImage from '../../../../../assets/rng-soccer/scoreboard/home.svg';
import awayDotImage from '../../../../../assets/rng-soccer/scoreboard/away.svg';
import drawDotImage from '../../../../../assets/rng-soccer/scoreboard/draw.svg';
import { BigRoadScoreboardPoint } from 'sc-scoreboards';
import { RNGSoccerRoundHistory } from '../../type';

const scoreboardImages: Record<string, string> = {
    home: homeDotImage,
    away: awayDotImage,
    draw: drawDotImage,
};

const RNGSoccerBigRoadItem: React.FC<{
    item: BigRoadScoreboardPoint<RNGSoccerRoundHistory>;
}> = ({ item }) => {
    if (!item.data || item.data.length === 0) {
        return null;
    }

    const firstItem = item.data[0];
    if (!firstItem || !firstItem.settlementResult) {
        return null;
    }

    const { home, draw } = firstItem.settlementResult;
    const imagePath = home ? scoreboardImages.home : draw ? scoreboardImages.draw : scoreboardImages.away;

    return (
        <div className={styles['dot-image']}>
                <img
                    src={imagePath}
                    style={{ width: '16px', height: '16px' }}
                alt="Natural"
            />
        </div>
    );
};

export default RNGSoccerBigRoadItem;
