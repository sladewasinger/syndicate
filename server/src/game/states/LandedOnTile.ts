import type { GameData } from '../../models/GameData';
import { StateName } from './StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { DistrictTile } from '../../models/tiles/DistrictTile';

export class LandedOnTile implements IGameState {
  name: StateName = StateName.LandedOnTile;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {
    const tile = gameData.tiles[gameData.currentPlayer.position];
    if (tile === undefined) {
      throw new Error(`Tile at player position '${gameData.currentPlayer.position}' not found`);
    }
    tile.onLanded(gameData);
  }

  onExit(gameData: GameData): void {
    this.nextState = this.name;
  }

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {
    switch (eventName) {
      case StateEvent.BuyProperty:
        this.nextState = StateName.BuyProperty;
        break;
      default:
        this.nextState = this.name;
        break;
    }
  }
}
