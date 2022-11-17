import type { IClientGameData } from './IClientGameData';
import type { IClientLobbyData } from './IClientLobbyData';

export interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  startGame: () => void;
  gameData: (gameData: IClientGameData) => void;
  lobbyData: (lobbyData: IClientLobbyData[]) => void;
  gameStarted: (gameData: IClientGameData) => void;
}
