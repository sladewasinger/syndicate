import { GameData } from '../models/GameData';
import { StateEvent } from '../StateEvents';
import { StateName } from '../StateNames';
import { State } from './State';

export class PreDiceRoll implements State {
  name: StateName = StateName.PreDiceRoll;

  onEnter(gameData: GameData): void {}

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): StateName {
    switch (eventName) {
      case StateEvent.RollDice:
        return this.rollDice(gameData);
      default:
        return this.name;
    }
  }

  rollDice(gameData: GameData): StateName {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    gameData.dice = gameData.diceOverride || [dice1, dice2];
    gameData.currentPlayer.targetPosition =
      gameData.currentPlayer.position + gameData.dice.reduce((cur, next) => cur + next, 0);

    if (gameData.currentPlayer.targetPosition > gameData.tiles.length) {
      gameData.currentPlayer.targetPosition = gameData.currentPlayer.position % gameData.tiles.length;
    }

    return StateName.PostDiceRoll;
  }
}
