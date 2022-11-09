import type { GameData } from '../../models/GameData';
import { StateName } from './StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { Player } from 'src/models/Player';
import { IBuildableTile } from 'src/models/tiles/ITile';

export class TurnEnd implements IGameState {
  name: StateName = StateName.TurnEnd;
  nextState: StateName = this.name;

  onEnter(): void {}

  onExit(): void {
    this.nextState = this.name;
  }

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {
    switch (eventName) {
      case StateEvent.EndTurn:
        console.log('TurnEnd: EndTurn');
        this.nextState = this.nextPlayer(gameData);
        break;
      case StateEvent.BuyBuilding:
        this.nextState = this.buyBuilding(gameData);
        break;
      default:
        this.nextState = this.name;
        break;
    }
  }

  buyBuilding(gameData: GameData): StateName {
    // const tilePosition = gameData.lastSelectedTilePosition;
    // if (!tilePosition) {
    //   gameData.log('No tile selected');
    //   return this.name;
    // }
    // const tile = gameData.tiles[tilePosition] as IBuildableTile;
    // if (tile.buildingCount === undefined || tile.buildingCost === undefined) {
    //   gameData.log('Cannot build on this tile');
    //   return this.name;
    // }
    // if (!tile.owner || tile.owner?.id !== gameData.currentPlayer?.id) {
    //   gameData.log('You do not own this property');
    //   return this.name;
    // }
    // if (tile.buildingCount >= 5) {
    //   gameData.log('You cannot build any more buildings on this property');
    //   return this.name;
    // }
    // if (gameData.currentPlayer.money < tile.buildingCost) {
    //   gameData.log('You do not have enough money to build a building');
    //   return this.name;
    // }

    return StateName.BuyBuilding;

    // tile.buildingCount++;
    // gameData.currentPlayer.money -= tile.buildingCost;

    // const buildingOrSkyscraper = tile.buildingCount === 5 ? 'skyscraper' : 'building';
    // gameData.log(`Player ${gameData.currentPlayer?.name} bought a ${buildingOrSkyscraper} on ${tile.name}`);
  }

  nextPlayer(gameData: GameData): StateName {
    let nextPlayer;

    if (gameData.players.length === 0) {
      return StateName.GameOver;
    }

    if (gameData.players.length == 1) {
      return StateName.TurnStart;
    }

    let count = 0;
    do {
      nextPlayer = gameData.players.shift() as Player;
      gameData.players.push(nextPlayer);
      count++;
    } while (nextPlayer.bankrupt && count < gameData.players.length);

    if (count == gameData.players.length) {
      gameData.winner = gameData.currentPlayer;
      return StateName.GameOver;
    }

    return StateName.TurnStart;
  }
}
