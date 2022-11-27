import { randomUUID } from 'crypto';
import { GameDataCallbacks } from 'src/game/Game';
import { Auction } from './Auction';
import { Player } from './Player';
import { TileType } from './shared/TileType';
import { TradeOffer } from './shared/TradeOffer';
import { DistrictTile } from './tiles/DistrictTile';
import { EventTile } from './tiles/EventTile';
import { GoToPrisonTile } from './tiles/GoToPrisonTile';
import type { ITile } from './tiles/ITile';
import { ParkTile } from './tiles/ParkTile';
import { PrisonTile } from './tiles/PrisonTile';
import { StartTile } from './tiles/StartTile';
import { SubwayTile } from './tiles/SubwayTile';
import { TaxTile } from './tiles/TaxTile';
import { UtilityTile } from './tiles/UtilityTile';
import {
  BankErrorInFavor_Event,
  DoctorsFees_Event,
  EventCard,
  GoTo18thStreet_Event,
  GoTo1stStreet_Event,
  GoTo34thStreet_Event,
  GoTo39thStreet_Event,
  GoToElectricCompany_Event,
  GoToInternetCompany_Event,
  GoToJail_Event,
  GoToStart_Event,
  IncomeTaxRefund_Event,
  PayTaxesOnAllHouses_Event,
  PayTaxesOnAllProperties_Event,
  SwapPositionWithAnotherPlayer_Event,
} from './events/EventCard';

export class GameData {
  private _log: string[] = [];

  players: Player[] = [];
  dice: number[] = [];
  diceOverride: number[] | null = null;
  diceDoublesInARow: number = 0;
  tiles: ITile[] = [];
  winner: Player | null = null;
  shuffleTiles: boolean = false;
  callbacks: GameDataCallbacks;
  lastSelectedTilePosition: number | undefined;
  tradeOffers: TradeOffer[] = [];
  auction: Auction | undefined;
  eventCards: EventCard[] = [];

  constructor(callbacks: GameDataCallbacks) {
    this.callbacks = callbacks;
    this.eventCards = [
      new GoToStart_Event(),
      new GoToJail_Event(),
      new SwapPositionWithAnotherPlayer_Event(),
      new PayTaxesOnAllHouses_Event(),
      new PayTaxesOnAllProperties_Event(),
      new GoToInternetCompany_Event(),
      new GoTo39thStreet_Event(),
      new GoToElectricCompany_Event(),
      new GoTo18thStreet_Event(),
      new GoTo1stStreet_Event(),
      new GoTo34thStreet_Event(),
      new BankErrorInFavor_Event(),
      new DoctorsFees_Event(),
      new IncomeTaxRefund_Event(),
    ];
    this.eventCards = [new GoTo39thStreet_Event()];

    // shuffle event cards:
    for (let i = this.eventCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.eventCards[i], this.eventCards[j]] = [this.eventCards[j], this.eventCards[i]];
    }

    this.tiles = [
      new StartTile(),
      new DistrictTile('1st Street', 60, 0x562074, [2, 10, 30, 90, 160, 500], 50, 50),
      new EventTile(),
      new DistrictTile('3rd Street', 60, 0x562074, [4, 20, 60, 180, 320, 600], 50, 50),
      new TaxTile(),
      new SubwayTile('New York Subway', 200),
      new DistrictTile('6th Street', 100, 0xaae0fa, [6, 30, 90, 270, 400, 550], 100, 100),
      new EventTile(),
      new DistrictTile('8th Street', 100, 0xaae0fa, [6, 30, 90, 270, 400, 550], 100, 100),
      new DistrictTile('9th Street', 120, 0xaae0fa, [8, 40, 100, 300, 450, 600], 100, 100),
      new PrisonTile(),
      new DistrictTile('11th Street', 140, 0xd93a96, [10, 50, 150, 450, 625, 750], 100, 100),
      new UtilityTile('Electric Company', 150, TileType.Electric),
      new DistrictTile('13th Street', 140, 0xd93a96, [10, 50, 150, 450, 625, 750], 150, 150),
      new DistrictTile('14th Street', 160, 0xd93a96, [12, 60, 180, 500, 700, 900], 150, 150),
      new SubwayTile('Chicago "L"', 200),
      new DistrictTile('16th Street', 180, 0xf7941d, [14, 70, 200, 550, 750, 950], 150, 150),
      new EventTile(),
      new DistrictTile('18th Street', 180, 0xf7941d, [14, 70, 200, 550, 750, 950], 150, 150),
      new DistrictTile('19th Street', 200, 0xf7941d, [16, 80, 220, 600, 800, 1000], 200, 200),
      new ParkTile(),
      new DistrictTile('21st Street', 220, 0xff0000, [18, 90, 250, 700, 875, 1050], 200, 200),
      new EventTile(),
      new DistrictTile('23rd Street', 220, 0xff0000, [18, 90, 250, 700, 875, 1050], 200, 200),
      new DistrictTile('24th Street', 240, 0xff0000, [20, 100, 300, 750, 925, 1100], 200, 200),
      new SubwayTile('Blue Line', 200),
      new DistrictTile('26th Street', 260, 0xf1e800, [22, 110, 330, 800, 975, 1150], 200, 200),
      new DistrictTile('27th Street', 260, 0xf1e800, [22, 110, 330, 800, 975, 1150], 200, 200),
      new UtilityTile('Internet Company', 150, TileType.Internet),
      new DistrictTile('29th Street', 280, 0xf1e800, [24, 120, 360, 850, 1025, 1200], 200, 200),
      new GoToPrisonTile(),
      new DistrictTile('31st Street', 300, 0x1fb25a, [26, 130, 390, 900, 1100, 1275], 200, 200),
      new DistrictTile('32nd Street', 300, 0x1fb25a, [26, 130, 390, 900, 1100, 1275], 200, 200),
      new EventTile(),
      new DistrictTile('34th Street', 320, 0x1fb25a, [26, 150, 450, 1000, 1200, 1400], 200, 200),
      new SubwayTile('Washington Metro', 200),
      new EventTile(),
      new DistrictTile('37th Street', 350, 0x0072bb, [50, 200, 600, 1400, 1700, 2000], 200, 200),
      new TaxTile(),
      new DistrictTile('39th Street', 400, 0x0072bb, [50, 200, 600, 1400, 1700, 2000], 200, 200),
    ];

    if (this.shuffleTiles) {
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
    return this.players[0] || new Player('No player', randomUUID()); // TODO: remove this;
  }

  getLog(): string[] {
    return this._log;
  }

  log(msg: string): void {
    console.log(msg);
    this._log.push(msg);
  }
}
