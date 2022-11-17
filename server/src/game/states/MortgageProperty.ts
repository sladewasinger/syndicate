import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { IBuildableTile } from 'src/models/tiles/ITile';

export class MortgageProperty implements IGameState {
  name: StateName = StateName.MortgageProperty;
  nextState: StateName = StateName.TurnEnd;

  onEnter(gameData: GameData): void {
    const tilePosition = gameData.lastSelectedTilePosition;
    if (!tilePosition) {
      gameData.log('No tile selected');
      return;
    }
    const tile = gameData.tiles[tilePosition] as IBuildableTile;
    if (!tile || tile.mortgaged == undefined || tile.mortgageValue == undefined) {
      gameData.log('Cannot mortgage this tile');
      return;
    }
    if (!tile.owner || tile.owner?.id !== gameData.currentPlayer?.id) {
      gameData.log('You do not own this property');
      console.log('tile.owner', tile.owner);
      return;
    }
    if (tile.mortgaged) {
      gameData.log('This property is already mortgaged');
      return;
    }

    tile.mortgaged = true;
    gameData.currentPlayer.money += tile.mortgageValue;

    gameData.log(`Player ${gameData.currentPlayer.name} mortgaged ${tile.name} for $${tile.mortgageValue}`);
  }

  onExit(): void {}

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
