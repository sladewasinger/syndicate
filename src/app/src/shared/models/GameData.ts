import type { Player } from './Player';
import { DistrictTile } from './tiles/DistrictTile';
import type { ITile } from './tiles/ITile';
import { PrisonTile } from './tiles/PrisonTile';
import { StartTile } from './tiles/StartTile';

export class GameData {
  players: Player[] = [];
  dice: number[] = [];
  diceOverride: number[] | null = null;
  tiles: ITile[] = [];
  winner: Player | null = null;
  private _log: string[] = [];

  constructor() {
    this.tiles = [
      new StartTile('Start'),
      new DistrictTile('1st Street', 60, 0xff0000, [2, 10, 30, 90, 160, 250], 50, 50),
      new DistrictTile('2nd Street', 60, 0xff0000, [4, 20, 60, 180, 320, 450], 50, 50),
      new DistrictTile('3rd Street', 100, 0xff0000, [6, 30, 90, 270, 400, 550], 50, 50),
      new DistrictTile('4th Street', 100, 0xff0000, [6, 30, 90, 270, 400, 550], 50, 50),
      new DistrictTile('5th Street', 120, 0xff0000, [8, 40, 100, 300, 450, 600], 50, 50),
      new DistrictTile('6th Street', 140, 0xff0000, [10, 50, 150, 450, 625, 750], 100, 100),
      new DistrictTile('7th Street', 140, 0xff0000, [10, 50, 150, 450, 625, 750], 100, 100),
      new DistrictTile('8th Street', 160, 0xff0000, [12, 60, 180, 500, 700, 900], 100, 100),
      new DistrictTile('9th Street', 180, 0xff0000, [14, 70, 200, 550, 750, 950], 100, 100),
      new PrisonTile(),
      new DistrictTile('10th Street', 180, 0xff0000, [14, 70, 200, 550, 750, 950], 100, 100),
      new DistrictTile('11th Street', 200, 0xff0000, [16, 80, 220, 600, 800, 1000], 100, 100),
      new DistrictTile('12th Street', 220, 0xff0000, [18, 90, 250, 700, 875, 1050], 150, 150),
      new DistrictTile('13th Street', 220, 0xff0000, [18, 90, 250, 700, 875, 1050], 150, 150),
      new DistrictTile('14th Street', 240, 0xff0000, [20, 100, 300, 750, 925, 1100], 150, 150),
      new DistrictTile('15th Street', 260, 0xff0000, [22, 110, 330, 800, 975, 1150], 150, 150),
      new DistrictTile('16th Street', 260, 0xff0000, [22, 110, 330, 800, 975, 1150], 150, 150),
      new DistrictTile('17th Street', 280, 0xff0000, [24, 120, 360, 850, 1025, 1200], 150, 150),
      new DistrictTile('18th Street', 300, 0xff0000, [26, 130, 390, 900, 1100, 1275], 200, 200),
      new DistrictTile('19th Street', 300, 0xff0000, [26, 130, 390, 900, 1100, 1275], 200, 200),
      new DistrictTile('20th Street', 320, 0xff0000, [28, 150, 450, 1000, 1200, 1400], 200, 200),
      new DistrictTile('21st Street', 350, 0xff0000, [35, 175, 500, 1100, 1300, 1500], 200, 200),
      new DistrictTile('22nd Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
    ];
  }

  get currentTile(): ITile {
    return this.tiles[this.currentPlayer.position];
  }

  get currentPlayer(): Player {
    return this.players[0];
  }

  getLog(): string[] {
    return this._log;
  }

  log(msg: string): void {
    this._log.push(msg);
  }
}
