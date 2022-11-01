import type { GameData } from '../models/GameData';
import type { IGameState } from './states/IGameState';
import { StateEvent } from './states/StateEvents';

export class StateMachine {
  private _state: IGameState;
  private _states: { [key: string]: IGameState };

  constructor(initialState: IGameState, public gameData: GameData) {
    this._states = {};
    this.addState(initialState);
    this._state = initialState;
  }

  get currentState() {
    return this._state;
  }

  public addState(IGameState: IGameState) {
    this._states[IGameState.name] = IGameState;
  }

  public setState(stateName: string) {
    const IGameState = this._states[stateName];
    if (IGameState === undefined) {
      throw new Error(`IGameState ${stateName} not found`);
    }
    this._state.onExit(this.gameData);
    this._state = IGameState;
    this._state.onEnter(this.gameData);
  }

  public event(event: StateEvent) {
    const nextState = this._state.event(event, this.gameData);
    this.setState(nextState);
  }

  public update() {
    const nextState = this._state.update(this.gameData);
    this.setState(nextState);
  }
}
