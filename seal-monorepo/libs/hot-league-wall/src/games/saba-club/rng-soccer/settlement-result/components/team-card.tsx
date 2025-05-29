import React from 'react';
import styles from '../../rng-soccer.module.scss';

export interface TeamCardProps {
    logo: string;
    isHomeTeam?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({
    logo,
    isHomeTeam = true
}) => {
    return (
        <div className={`${styles['sport-team']} ${isHomeTeam ? styles['home-team'] : styles['away-team']}`}>
            <div className={styles['sport-team-img']}>
                <img src={logo} alt={`${isHomeTeam ? 'home' : 'away'}-team`} />
            </div>
        </div>
    );
};

export default TeamCard; 