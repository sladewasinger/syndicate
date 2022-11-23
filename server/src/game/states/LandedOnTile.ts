import type { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { DistrictTile } from '../../models/tiles/DistrictTile';
import { IBuyableTile } from 'src/models/tiles/ITile';

export class LandedOnTile implements IGameState {
  name: StateName = StateName.LandedOnTile;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {
    const tile = gameData.tiles[gameData.currentPlayer.position];
    if (tile === undefined) {
      throw new Error(`Tile at player position '${gameData.currentPlayer.position}' not found`);
    }
    this.nextState = tile.onLanded(gameData, this.name);
  }

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {
    switch (eventName) {
      case StateEvent.BuyProperty:
        this.nextState = StateName.BuyProperty;
        break;
      case StateEvent.AuctionProperty:
        this.nextState = StateName.AuctionProperty;
        break;
      default:
        this.nextState = this.nextState;
        break;
    }
  }
}
