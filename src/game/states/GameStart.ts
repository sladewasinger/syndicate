import { GameData } from "../models/GameData";

export class GameStart {
    name: string = 'GameStart';

    onEnter(): void {
    }

    onExit(): void {
    }

    update(gameData: GameData): string {
        return 'RollDice';
    }
}
