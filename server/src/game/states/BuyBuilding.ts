import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { IBuildableTile } from 'src/models/tiles/ITile';

export class BuyBuilding implements IGameState {
  name: StateName = StateName.BuyBuilding;
  nextState: StateName = StateName.TurnEnd;

  onEnter(gameData: GameData): void {
    const tilePosition = gameData.lastSelectedTilePosition;
    if (!tilePosition) {
      gameData.log('No tile selected');
      return;
    }
    const tile = gameData.tiles[tilePosition] as IBuildableTile;
    if (tile.buildingCount === undefined || tile.buildingCost === undefined) {
      gameData.log('Cannot build on this tile');
      return;
    }
    if (!tile.owner || tile.owner?.id !== gameData.currentPlayer?.id) {
      gameData.log('You do not own this property');
      console.log('tile.owner', tile.owner);
      return;
    }
    if (tile.buildingCount >= 5) {
      gameData.log('You cannot build any more buildings on this property');
      return;
    }
    if (gameData.currentPlayer.money < tile.buildingCost) {
      gameData.log('You do not have enough money to build a building');
      return;
    }

    tile.buildingCount++;
    gameData.currentPlayer.money -= tile.buildingCost;

    const buildingOrSkyscraper = tile.buildingCount === 5 ? 'skyscraper' : 'building';
    gameData.log(`Player ${gameData.currentPlayer?.name} bought a ${buildingOrSkyscraper} on ${tile.name}`);
  }

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
