import { GameData } from '../models/GameData';
import { Player } from '../models/Player';
import { StateEvent } from '../StateEvents';
import { StateName } from '../StateNames';
import { GameStart } from './GameStart';
import { State } from './State';

export class TurnEnd implements State {
  name: StateName = StateName.TurnEnd;

  onEnter(): void {}

  onExit(): void {}

  update(gameData: GameData): StateName {
    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): StateName {
    switch (eventName) {
      case StateEvent.EndTurn:
        return this.nextPlayer(gameData);
      default:
        return this.name;
    }
  }

  nextPlayer(gameData: GameData): StateName {
    let nextPlayer;

    if (gameData.players.length === 0) {
      return StateName.GameOver;
    }

    if (gameData.players.length == 1) {
      nextPlayer = gameData.currentPlayer;
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
