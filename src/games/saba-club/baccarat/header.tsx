import React from 'react';
import { observer } from '@sg/sg-observer';
import { setting } from './game-settings';
import styles from './baccarat.module.scss';

interface IBaccaratHeaderProps {
    namespace: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    gameId: number;
}

@observer(setting.mainObserverNamespace)
export default class BaccaratHeader extends React.Component<IBaccaratHeaderProps> {
    render() {
        return (
            <div className={styles['baccarat-header']}>
                <h1>{setting.name}</h1>
                <div className={styles['controls']}>
                    <button
                        className={styles['expand-button']}
                        onClick={this.props.onToggleExpand}
                    >
                        {this.props.isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
            </div>
        );
    }
} 