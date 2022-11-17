import type { IClientGameData } from './IClientGameData';
import type { IClientLobbyData } from './IClientLobbyData';
import { IClientUser } from './IClientUser';
import type { SocketError } from './SocketError';

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
  endTurn: (callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
}
