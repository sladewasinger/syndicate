import type { GameData } from '../../models/GameData';
import { StateName } from './StateNames';
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
    const buyableTile = tile as IBuyableTile;

    if (buyableTile && gameData.currentPlayer.money >= buyableTile.price) {
      gameData.currentPlayer.money -= buyableTile.price;
      gameData.currentPlayer.properties.push(tile.id);
      tile.owner = gameData.currentPlayer;
      gameData.log(`${gameData.currentPlayer.name} bought ${tile.name} for ${buyableTile.price}`);
      return StateName.TurnEnd;
    }

    gameData.log('You cannot buy this property');
    return this.name;
  }
}
