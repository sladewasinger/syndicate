import { GameData } from '../models/GameData';
import { StateEvent } from '../StateEvents';
import { StateName } from '../StateNames';
import { State } from './State';

export class PostDiceRoll implements State {
  name: StateName = StateName.PostDiceRoll;

  onEnter(gameData: GameData): void {}

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    gameData.currentPlayer.position += gameData.dice.reduce((cur, next) => cur + next, 0);
    if (gameData.currentPlayer.position > gameData.tiles.length) {
      gameData.currentPlayer.position -= gameData.tiles.length;
    }
    if (gameData.currentPlayer.position == gameData.currentPlayer.targetPosition) {
      return StateName.LandedOnTile;
    }
    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): StateName {
    return this.name;
  }
}
