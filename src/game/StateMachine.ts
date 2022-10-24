import { GameData } from './models/GameData';
import { State } from './states/State';

export class StateMachine {
    private _state: State;
    private _states: { [key: string]: State };

    constructor(initialState: State, public gameData: GameData) {
        this._states = {};
        this.addState(initialState);
        this._state = initialState;
    }

    public addState(state: State) {
        this._states[state.name] = state;
    }

    private setState(stateName: string) {
        const state = this._states[stateName];
        if (state === undefined) {
            throw new Error(`State ${stateName} not found`);
        }
        this._state = state;
    }

    public update() {
        const nextState = this._state.update(this.gameData);
        this.setState(nextState);
    }
}


