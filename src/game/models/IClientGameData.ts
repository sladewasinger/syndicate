import { IClientTile, ITile } from '../tiles/ITile';
import { Player } from './Player';

export interface IClientGameData {
  myId: string;
  players: Player[];
  currentPlayer: Player;
  dice: number[];
  tiles: IClientTile[];
  state: string;
}
