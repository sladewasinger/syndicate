import { IClientGameData } from './shared/IClientGameData';
import { IClientPlayer } from './shared/IClientPlayer';

export class Player {
  targetPosition: number;
  name: string;
  id: string;
  money: number;
  position: number;
  properties: string[] = [];
  color: number = 0;
  turnOrder: number = 0;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    this.money = 1500;
    this.position = 0;
    this.targetPosition = 0;
  }

  get bankrupt(): boolean {
    return this.money <= 0;
  }

  get clientPlayer(): IClientPlayer {
    const clientPlayer: IClientPlayer = {
      targetPosition: this.targetPosition,
      name: this.name,
      id: this.id,
      money: this.money,
      position: this.position,
      properties: this.properties,
      color: this.color,
      turnOrder: this.turnOrder,
    };
    return clientPlayer;
  }
}
