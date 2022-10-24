import { GameData } from './models/GameData';
import { StateMachine } from './StateMachine';
import { RollDice } from './states/RollDice';
import { TurnStart } from './states/TurnStart';

export class Game {
    stateMachine: StateMachine;

    constructor() {
        this.stateMachine = new StateMachine(new TurnStart(), new GameData());
        this.stateMachine.addState(new RollDice());
    }
} 
