import { GameDataCallbacks } from 'src/game/Game';
import { Player } from './shared/Player';
import { DistrictTile } from './tiles/DistrictTile';
import { EventTile } from './tiles/EventTile';
import { GoToPrisonTile } from './tiles/GoToPrisonTile';
import type { ITile } from './tiles/ITile';
import { ParkTile } from './tiles/ParkTile';
import { PrisonTile } from './tiles/PrisonTile';
import { StartTile } from './tiles/StartTile';
import { SubwayTile } from './tiles/SubwayTile';
import { TaxTile } from './tiles/TaxTile';

export class GameData {
  players: Player[] = [];
  dice: number[] = [];
  diceOverride: number[] | null = null;
  tiles: ITile[] = [];
  winner: Player | null = null;
  shuffle: boolean = false;
  callbacks: GameDataCallbacks;
  private _log: string[] = [];

  constructor(callbacks: GameDataCallbacks) {
    this.callbacks = callbacks;
    this.tiles = [
      new StartTile(),
      new DistrictTile('1st Street', 60, 0x562074, [2, 10, 30, 90, 160, 250], 50, 50),
      new EventTile(),
      new DistrictTile('3rd Street', 100, 0x562074, [6, 30, 90, 270, 400, 550], 50, 50),
      new TaxTile(),
      new SubwayTile('New York Subway', 200),
      new DistrictTile('6th Street', 140, 0xff0000, [10, 50, 150, 450, 625, 750], 100, 100),
      new DistrictTile('7th Street', 140, 0xff0000, [10, 50, 150, 450, 625, 750], 100, 100),
      new DistrictTile('8th Street', 160, 0xff0000, [12, 60, 180, 500, 700, 900], 100, 100),
      new DistrictTile('9th Street', 180, 0xff0000, [14, 70, 200, 550, 750, 950], 100, 100),
      new PrisonTile(),
      new DistrictTile('11th Street', 180, 0xff0000, [14, 70, 200, 550, 750, 950], 100, 100),
      new DistrictTile('12th Street', 200, 0xff0000, [16, 80, 220, 600, 800, 1000], 100, 100),
      new DistrictTile('13th Street', 220, 0xff0000, [18, 90, 250, 700, 875, 1050], 150, 150),
      new DistrictTile('14th Street', 220, 0xff0000, [18, 90, 250, 700, 875, 1050], 150, 150),
      new SubwayTile('Chicago "L"', 200),
      new DistrictTile('16th Street', 260, 0xff0000, [22, 110, 330, 800, 975, 1150], 150, 150),
      new DistrictTile('17th Street', 260, 0xff0000, [22, 110, 330, 800, 975, 1150], 150, 150),
      new DistrictTile('18th Street', 280, 0xff0000, [24, 120, 360, 850, 1025, 1200], 150, 150),
      new DistrictTile('19th Street', 300, 0xff0000, [26, 130, 390, 900, 1100, 1275], 200, 200),
      new ParkTile(),
      new DistrictTile('21st Street', 300, 0xff0000, [26, 130, 390, 900, 1100, 1275], 200, 200),
      new DistrictTile('22nd Street', 320, 0xff0000, [28, 150, 450, 1000, 1200, 1400], 200, 200),
      new DistrictTile('23rd Street', 350, 0xff0000, [35, 175, 500, 1100, 1300, 1500], 200, 200),
      new DistrictTile('24th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new SubwayTile('Blue Line', 200),
      new DistrictTile('26th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new DistrictTile('27th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new DistrictTile('28th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new DistrictTile('29th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new GoToPrisonTile(),
      new DistrictTile('31st Street', 300, 0xff0000, [26, 130, 390, 900, 1100, 1275], 200, 200),
      new DistrictTile('32nd Street', 350, 0xff0000, [35, 175, 500, 1100, 1300, 1500], 200, 200),
      new DistrictTile('33rd Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new DistrictTile('34th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new SubwayTile('Washington Metro', 200),
      new DistrictTile('36th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new DistrictTile('37th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new DistrictTile('38th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new DistrictTile('39th Street', 400, 0xff0000, [50, 200, 600, 1400, 1700, 2000], 200, 200),
    ];

    if (this.shuffle) {
      for (let i = this.tiles.length - 1; i > 0; i--) {
        if (i == 0 || i == 10 || i == 20 || i == 30) {
          continue;
        }
        let j;
        do {
          j = Math.floor(Math.random() * (i + 1));
        } while (j == 0 || j == 10 || j == 20 || j == 30);
        [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
      }
    }
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
