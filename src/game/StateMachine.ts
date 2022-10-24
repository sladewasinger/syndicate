import { GameData } from './models/GameData';
import { State } from './states/State';
import { StateEvent } from './StateEvents';

export class StateMachine {
  private _state: State;
  private _states: { [key: string]: State };

  constructor(initialState: State, public gameData: GameData) {
    this._states = {};
    this.addState(initialState);
    this._state = initialState;
  }

  get currentState() {
    return this._state;
  }

  public addState(state: State) {
    this._states[state.name] = state;
  }

  public setState(stateName: string) {
    const state = this._states[stateName];
    if (state === undefined) {
      throw new Error(`State ${stateName} not found`);
    }
    this._state.onExit(this.gameData);
    this._state = state;
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
