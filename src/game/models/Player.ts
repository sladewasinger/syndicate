export class Player {
  targetPosition: number;
  name: string;
  id: string;
  money: number;
  position: number;
  properties: string[] = [];

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
}
