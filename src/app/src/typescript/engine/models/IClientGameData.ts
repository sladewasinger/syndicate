import type { Player } from '@/shared/models/Player';
import type { IClientTile } from '@/shared/models/tiles/IClientTile';

export interface IClientGameData {
  myId: string;
  players: Player[];
  currentPlayer: Player;
  dice: number[];
  tiles: IClientTile[];
  state: string;
}
