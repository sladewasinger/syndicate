import type { IClientGameData } from './IClientGameData';
import { IClientLobbyData } from './IClientLobbyData';
import { IClientUser } from './IClientUser';
import type { SocketError } from './SocketError';
import { TradeOffer } from './TradeOffer';

export interface ClientToServerEvents {
  registerName: (name: string, callback: (error: SocketError | null, data: IClientUser | undefined) => void) => void;
  createLobby: (callback: (error: SocketError | null, data: IClientLobbyData | null) => void) => void;
  joinLobby: (key: string, callback: (error: SocketError | null, data: IClientLobbyData | null) => void) => void;
  startGame: (callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
  rollDice: (
    dice1Override: number | undefined,
    dice2Override: number | undefined,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
  buyProperty: (callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
  auctionProperty: (callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
  auctionBid: (bid: number, callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
  endTurn: (callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
  declareBankruptcy: (callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
  buyBuilding: (
    propertyIndex: number,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
  sellBuilding: (
    propertyIndex: number,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
  mortgageProperty: (
    propertyIndex: number,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
  unmortgageProperty: (
    propertyIndex: number,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
  createTradeOffer: (
    offer: TradeOffer,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
  acceptTradeOffer: (
    offerId: string,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
  cancelTradeOffer: (
    offerId: string,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
}
