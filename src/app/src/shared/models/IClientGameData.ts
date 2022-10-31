import type { Player } from './Player';
import type { IClientTile } from './tiles/IClientTile';

export interface IClientGameData {
  myId: string;
  players: Player[];
  currentPlayer: Player;
  dice: number[];
  tiles: IClientTile[];
  state: string;
}
