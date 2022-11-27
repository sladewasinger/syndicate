import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { IBuyableTile } from 'src/models/tiles/ITile';

export class BuyProperty implements IGameState {
  name: StateName = StateName.BuyProperty;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {
    const tile = gameData.currentTile;
    const buyableTile = tile as IBuyableTile;

    if (buyableTile.buyable && gameData.currentPlayer.money >= buyableTile.price) {
      gameData.currentPlayer.money -= buyableTile.price;
      gameData.currentPlayer.properties.push(tile.id);
      tile.owner = gameData.currentPlayer;
      gameData.log(`${gameData.currentPlayer.name} bought ${tile.name} for $${buyableTile.price}`);
    } else {
      gameData.log('You cannot buy this property');
    }

    this.nextState = StateName.TurnEnd;
  }

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
