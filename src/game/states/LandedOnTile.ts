import { GameData } from '../models/GameData';
import { StateEvent } from '../StateEvents';
import { StateName } from '../StateNames';
import { State } from './State';
import { PropertyTile } from './tiles/PropertyTile';

export class LandedOnTile implements State {
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
    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): StateName {
    switch (eventName) {
      case StateEvent.BuyProperty:
        return this.buyProperty(gameData);
      default:
        return this.name;
    }
  }

  buyProperty(gameData: GameData): StateName {
    const tile = gameData.currentTile;
    if (tile instanceof PropertyTile && tile.owner === undefined && gameData.currentPlayer.money >= tile.price) {
      gameData.currentPlayer.money -= tile.price;
      gameData.currentPlayer.properties.push(tile.id);
      tile.owner = gameData.currentPlayer;
      return StateName.TurnEnd;
    }
    return this.name;
  }
}
