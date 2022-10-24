import { PropertyTile } from '../tiles/PropertyTile';
import { StartTile } from '../tiles/StartTile';
import { Tile } from '../tiles/ITile';
import { Player } from './Player';

export class GameData {
  players: Player[] = [];
  dice: number[] = [];
  diceOverride: number[] | null = null;
  tiles: Tile[] = [];
  winner: Player | null = null;

  constructor() {
    this.tiles = [
      new StartTile('Start'),
      new PropertyTile('1st Street', 60, [2, 10, 30, 90, 160, 250], 50, 50),
      new PropertyTile('2nd Street', 60, [4, 20, 60, 180, 320, 450], 50, 50),
      new PropertyTile('3rd Street', 100, [6, 30, 90, 270, 400, 550], 50, 50),
    ];
  }

  get currentTile(): Tile {
    return this.tiles[this.currentPlayer.position];
  }

  get currentPlayer(): Player {
    return this.players[0];
  }
}
