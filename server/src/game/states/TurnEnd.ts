import type { GameData } from '../../models/GameData';
import { StateName } from './StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { Player } from 'src/models/Player';

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
      default:
        this.nextState = this.name;
        break;
    }
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

    if (count == gameData.players.length - 1) {
      gameData.winner = gameData.currentPlayer;
      return StateName.GameOver;
    }

    return StateName.TurnStart;
  }
}
