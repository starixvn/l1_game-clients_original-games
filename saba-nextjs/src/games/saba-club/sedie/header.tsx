import React from 'react';
import { GameHeader } from '../../../_shared/components/game-base/game-header/game-header';
import styles from './sedie.module.scss';
import classNames from 'classnames';
import GameHeaderCenterTexts from '../../../_shared/components/game-base/game-header/game-header-center-texts';

interface SedieHeaderProps {
    gameId: number;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    namespace: string;
    centerTextsComponent?: React.ReactNode;
}

const SedieHeader: React.FC<SedieHeaderProps> = ({ gameId, isExpanded, onToggleExpand, centerTextsComponent }) => {
    return (
        <div className={classNames(styles.header, 'sedie-header')}>
            <GameHeader
                gameId={gameId}
                isExpanded={isExpanded}
                onToggleExpand={onToggleExpand}
                centerTextsComponent={<GameHeaderCenterTexts texts={["Odd/Even", "Red/White"]} />}
                className={styles.sedieGameTitle}
            />
        </div>
    );
};

export default SedieHeader;
