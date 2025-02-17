import React from 'react';
import { GameHeader } from '../../../_shared/components/game-base/game-header/game-header';
import styles from './baccarat.module.scss';
import classNames from 'classnames';
import GameHeaderCenterTexts from '../../../_shared/components/game-base/game-header/game-header-center-texts';

interface BaccaratHeaderProps {
    gameId: number;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    namespace: string;
    centerTextsComponent?: React.ReactNode;
}

const BaccaratHeader: React.FC<BaccaratHeaderProps> = ({ gameId, isExpanded, onToggleExpand }) => {
    return (
        <div className={classNames(styles.header, 'baccarat-header')}>
            <GameHeader
                gameId={gameId}
                isExpanded={isExpanded}
                onToggleExpand={onToggleExpand}
                centerTextsComponent={<GameHeaderCenterTexts texts={["Player/Banker", "Tie", "Pair"]} />}
            />
        </div>
    );
};

export default BaccaratHeader; 