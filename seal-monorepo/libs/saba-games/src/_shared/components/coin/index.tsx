import emptyImage from "../../../assets/coin/empty.png"
import headImage from "../../../assets/coin/head.png"
import tailImage from "../../../assets/coin/tail.png"
import { CoinTossChoices } from "../../../games/saba-club/coin-toss/type"
import { Size } from "../../../_shared/constants";
import styles from "./coin.module.scss"

export enum CoinSymbol {
  EMPTY = -1,
  HEAD = 0,
  TAIL = 1,
}

const coinImages: Record<string, string> = {
  [CoinTossChoices.empty]: emptyImage,
  [CoinTossChoices.head]: headImage,
  [CoinTossChoices.tail]: tailImage,
}

interface ICoinProps {
  coinType: string;
  size?: typeof Size.large | typeof Size.medium | typeof Size.small;
}

const Coin: React.FC<ICoinProps> = ({ coinType, size = Size.medium }) => {
  const coinImageUrl = coinImages[coinType];

  return <img className={styles[`coin-${size}`]} src={coinImageUrl} alt={`coin-${coinType}`} />
}

export default Coin;