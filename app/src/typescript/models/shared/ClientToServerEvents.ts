import type { IClientGameData } from './IClientGameData';
import type { SocketError } from './SocketError';

export interface ClientToServerEvents {
  registerName: (name: string, callback: (error: SocketError | null, data: string | null) => void) => void;
  createLobby: (callback: (error: SocketError | null, data: string | null) => void) => void;
  joinLobby: (key: string, callback: (error: SocketError | null, data: string | null) => void) => void;
  startGame: (callback: (error: SocketError | null, data: IClientGameData | null) => void) => void;
}
