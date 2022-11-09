import type { IClientPlayer } from './IClientPlayer';
import type { IClientTile } from './IClientTile';

export interface IClientGameData {
  myId: string;
  players: IClientPlayer[];
  currentPlayer: IClientPlayer;
  dice: number[];
  tiles: IClientTile[];
  state: string;
  lastSelectedTilePosition: number | undefined;
}
