import type { IClientTile } from "./tiles/IClientTile";
import type { Player } from "./Player";

export interface IClientGameData {
  myId: string;
  players: Player[];
  currentPlayer: Player;
  dice: number[];
  tiles: IClientTile[];
  state: string;
}
