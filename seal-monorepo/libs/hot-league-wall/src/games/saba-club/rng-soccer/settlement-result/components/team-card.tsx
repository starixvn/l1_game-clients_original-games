import React from 'react';
import styles from '../../rng-soccer.module.scss';

export interface TeamCardProps {
    name: string;
    logo: string;
    color: string;
    isHomeTeam?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({
    name,
    logo,
    color,
    isHomeTeam = true
}) => {
    return (
        <div className={`${styles['sport-team']} ${isHomeTeam ? styles['home-team'] : styles['away-team']}`}>
            <div className={styles['sport-team-img']}>
                <img src={logo} alt={`${isHomeTeam ? 'home' : 'away'}-team`} />
            </div>
            <div
                className={styles['sport-team-name']}
                style={{ color }}
            >
                {name}
            </div>
        </div>
    );
};

export default TeamCard; 