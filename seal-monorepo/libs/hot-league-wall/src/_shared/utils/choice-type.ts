import { COIN_TOSS_GAME_NAMESPACE } from '../../../constant/app';
// import { SE_DIE_CHOICES, BACCARAT_CHOICES } from '../../games/constants/saba-club';

export const getChoicesType = (gameName: string, betChoice: string) => {
    if (gameName === COIN_TOSS_GAME_NAMESPACE) {
        return `${gameName}.choices_type`;
    }
    return 'choices_type';
}
