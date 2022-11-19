import type { IClientAuctionParticipant } from './IClientAuctionParticipant';
import type { IClientPlayer } from './IClientPlayer';
import type { IClientTile } from './IClientTile';
import type { TradeOffer } from './TradeOffer';

export interface IClientGameData {
  myId: string;
  players: IClientPlayer[];
  currentPlayer: IClientPlayer;
  dice: number[];
  tiles: IClientTile[];
  state: string;
  lastSelectedTilePosition: number | undefined;
  tradeOffers: TradeOffer[];
  auctionParticipants: IClientAuctionParticipant[];
  auctionWinner: IClientPlayer | undefined;
}
