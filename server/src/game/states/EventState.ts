import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class EventState implements IGameState {
  name: StateName = StateName.Event;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {
    this.nextState = StateName.TurnEnd;
  }

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    const eventCard = gameData.eventCards.pop();

    if (eventCard) {
      gameData.eventCards.unshift(eventCard);

      this.nextState = eventCard.execute(gameData);

      gameData.log(`Event: ${gameData.currentPlayer.name} - ${eventCard.description}`);
      gameData.callbacks.onGameMessage(`Event: ${eventCard.description}`);
    }

    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
