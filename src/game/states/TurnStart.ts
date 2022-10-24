import { GameData } from '../models/GameData';
import { StateName } from '../StateNames';
import { State } from './State';

export class TurnStart implements State {
    name: StateName = StateName.TurnStart;

    onEnter(): void {
    }

    onExit(): void {
    }

    update(gameData: GameData): StateName {
        return StateName.PreDiceRoll;
    }

    event(eventName: string, gameData: GameData): StateName {
        return this.name;
    }
}
