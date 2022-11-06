import { IClientPlayer } from './IClientPlayer';
import type { IClientTile } from './IClientTile';
import type { Player } from './Player';

export interface IClientGameData {
  myId: string;
  players: IClientPlayer[];
  currentPlayer: IClientPlayer;
  dice: number[];
  tiles: IClientTile[];
  state: string;
}
