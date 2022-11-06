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

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {
    switch (eventName) {
      case StateEvent.BuyProperty:
        this.nextState = this.buyProperty(gameData);
        break;
      default:
        this.nextState = this.name;
        break;
    }
  }

  buyProperty(gameData: GameData): StateName {
    const tile = gameData.currentTile;
    if (tile instanceof DistrictTile && tile.owner === undefined && gameData.currentPlayer.money >= tile.price) {
      gameData.currentPlayer.money -= tile.price;
      gameData.currentPlayer.properties.push(tile.id);
      tile.owner = gameData.currentPlayer;
      gameData.log(`${gameData.currentPlayer.name} bought ${tile.name} for ${tile.price}`);
      return StateName.TurnEnd;
    }
    gameData.log('You cannot buy this property');
    return this.name;
  }
}
