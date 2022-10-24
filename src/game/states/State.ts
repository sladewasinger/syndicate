import { GameData } from '../models/GameData';

export interface State {
    name: string;
    onEnter(): void;
    onExit(): void;
    update(gameData: GameData): string
}
