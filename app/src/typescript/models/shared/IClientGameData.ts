import type { IClientTile } from './IClientTile';
import type { IClientPlayer } from './IClientPlayer';

export interface IClientGameData {
  myId: string;
  players: IClientPlayer[];
  currentPlayer: IClientPlayer;
  dice: number[];
  tiles: IClientTile[];
  state: string;
}
