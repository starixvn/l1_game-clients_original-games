import emptyImage from "../../../assets/coin-history/empty.png"
import headImage from "../../../assets/coin-history/head.png"
import tailImage from "../../../assets/coin-history/tail.png"
import { CoinSymbol } from "../coin"
import styles from "./coin.module.scss"

const coinImages: Record<CoinSymbol, string> = {
  [CoinSymbol.EMPTY]: emptyImage,
  [CoinSymbol.HEAD]: headImage,
  [CoinSymbol.TAIL]: tailImage,
}

interface ICoinProps {
  coinType: CoinSymbol;
}

const CoinHistory: React.FC<ICoinProps> = ({ coinType }) => {
  const coinImageUrl = coinImages[coinType];

  return <img className={styles[`coin-container`]} src={coinImageUrl} alt={`coin-${coinType}`} />
}

export default CoinHistory;