import { IClientGameData } from '../shared/IClientGameData';
import type { SocketError } from './SocketError';

export interface ClientToServerEvents {
  registerName: (name: string, callback: (error: SocketError | null, data: string | null) => void) => void;
  createLobby: (callback: (error: SocketError | null, data: string | null) => void) => void;
  joinLobby: (key: string, callback: (error: SocketError | null, data: string | null) => void) => void;
  startGame: (callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
  rollDice: (
    dice1Override: number,
    dice2Override: number,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) => void;
}
