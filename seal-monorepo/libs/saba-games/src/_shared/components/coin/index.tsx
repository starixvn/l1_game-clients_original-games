import emptyImage from "../../../assets/coin/empty.png"
import headImage from "../../../assets/coin/head.png"
import tailImage from "../../../assets/coin/tail.png"

export enum CoinSymbol {
  EMPTY = -1,
  HEAD = 0,
  TAIL = 1,
}

const coinImages: Record<number, string> = {
  [CoinSymbol.EMPTY]: emptyImage,
  [CoinSymbol.HEAD]: headImage,
  [CoinSymbol.TAIL]: tailImage,
}

interface ICoinProps {
  coinType: number;
}

const Coin: React.FC<ICoinProps> = ({ coinType }) => {
  const coinImageUrl = coinImages[coinType];

  return <img src={coinImageUrl} alt={`coin-${coinType}`} />
}

export default Coin;