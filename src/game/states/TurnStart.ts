import { GameData } from '../models/GameData';
import { State } from './State';

export class TurnStart implements State {
    name: string = 'TurnStart';

    onEnter(): void {
    }

    onExit(): void {
    }

    update(gameData: GameData): string {
        return 'RollDice';
    }
}
