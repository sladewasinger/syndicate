import { GameData } from '../models/GameData';
import { StateEvent } from '../StateEvents';
import { StateName } from '../StateNames';

export interface State {
  name: StateName;
  onEnter(gameData: GameData): void;
  onExit(gameData: GameData): void;
  update(gameData: GameData): StateName;
  event(eventName: StateEvent, gameData: GameData): StateName;
}
