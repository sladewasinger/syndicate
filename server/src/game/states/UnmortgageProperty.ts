import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { IBuildableTile } from 'src/models/tiles/ITile';

export class UnmortgageProperty implements IGameState {
  name: StateName = StateName.UnmortgageProperty;
  nextState: StateName = StateName.TurnEnd;

  onEnter(gameData: GameData): void {
    const tilePosition = gameData.lastSelectedTilePosition;
    if (!tilePosition) {
      gameData.log('No tile selected');
      return;
    }
    const tile = gameData.tiles[tilePosition] as IBuildableTile;
    if (tile.mortgaged == undefined || tile.mortgageValue == undefined) {
      gameData.log('Cannot mortgage this tile');
      return;
    }
    if (!tile.owner || tile.owner?.id !== gameData.currentPlayer?.id) {
      gameData.log('You do not own this property');
      console.log('tile.owner', tile.owner);
      return;
    }
    if (!tile.mortgaged) {
      gameData.log('This property is not mortgaged');
      return;
    }
    const buybackValue = Math.floor(tile.mortgageValue * 1.1);
    if (gameData.currentPlayer.money < buybackValue) {
      gameData.log('You do not have enough money to unmortgage this property');
      return;
    }

    tile.mortgaged = false;
    gameData.currentPlayer.money -= buybackValue;

    gameData.log(`Player ${gameData.currentPlayer.name} lifted the mortgage on ${tile.name} for -$${buybackValue}`);
  }

  onExit(): void {}

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
