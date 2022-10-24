import { GameData } from '../models/GameData';

export class RollDice {
    name: string = 'RollDice';

    onEnter(): void {
    }

    onExit(): void {
    }

    update(gameData: GameData): string {
        return 'TurnStart';
    }

}