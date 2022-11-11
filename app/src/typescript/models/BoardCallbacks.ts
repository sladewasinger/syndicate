import type { TradeOffer } from './shared/TradeOffer';

export interface BoardCallbacks {
  rollDice: () => void;
  endTurn: () => void;
  buyProperty: () => void;
  auctionProperty: () => void;
  mortgageProperty: (tileId: number) => void;
  unmortgageProperty: (tileId: number) => void;
  buyBuilding: (tileId: number) => void;
  sellBuilding: (tileId: number) => void;
  openTrades: () => void;
  openCreateTrade: () => void;
  createTrade: (tradeOffer: TradeOffer) => void;
  declareBankruptcy: () => void;
}
