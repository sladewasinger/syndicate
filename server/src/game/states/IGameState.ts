import type { GameData } from '../../models/GameData';
import { StateEvent } from './StateEvents';
import type { StateName } from '../../models/shared/StateNames';

export interface IGameState {
  name: StateName;
  onEnter(gameData: GameData): void;
  onExit(gameData: GameData): void;
  update(gameData: GameData): StateName;
  event(eventName: StateEvent, gameData: GameData): void;
}
