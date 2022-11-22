import { PrisonTile } from '../../models/tiles/PrisonTile';
import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class InTraffic implements IGameState {
  name: StateName = StateName.InTraffic;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {
    let prisonTileIndex = gameData.tiles.findIndex((tile) => tile instanceof PrisonTile);
    if (prisonTileIndex === -1) {
      prisonTileIndex = 10;
    }
    console.log('InTraffic: onEnter');
    gameData.currentPlayer.position = prisonTileIndex;
    gameData.currentPlayer.targetPosition = prisonTileIndex;
    gameData.currentPlayer.isInJail = true;
    gameData.currentPlayer.jailTurns = 3;

    this.nextState = StateName.TurnEnd;

    gameData.callbacks.onGameMessage(`Player ${gameData.currentPlayer.name} is in traffic!`);
  }

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
