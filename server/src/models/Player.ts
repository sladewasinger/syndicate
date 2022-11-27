import { GameData } from './GameData';
import { IClientGameData } from './shared/IClientGameData';
import { IClientPlayer } from './shared/IClientPlayer';
import { IBuildableTile, IBuyableTile } from './tiles/ITile';

export class Player {
  targetPosition: number;
  name: string;
  id: string;
  money: number;
  position: number;
  properties: string[] = [];
  color: number = 0;
  turnOrder: number = 0;
  bidAmount: number | undefined = undefined;
  isInJail: boolean = false;
  jailTurns: number = 0;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    this.money = 1500;
    this.position = 0;
    this.targetPosition = 0;
  }

  isBankrupt(gameData: GameData): boolean {
    const ownedProperties = gameData.tiles
      .filter((tile) => tile.owner?.id === this.id)
      .map((tile) => tile as IBuyableTile);
    const mortgageableProperties = ownedProperties.filter((t) => t.mortgaged === false);
    const propertiesWithHouses = ownedProperties
      .map((t) => t as IBuildableTile)
      .filter((t) => t.buildingCount != undefined)
      .filter((t) => t.buildingCount > 0);
    return this.money <= 0 && mortgageableProperties.length === 0 && propertiesWithHouses.length === 0;
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
      bidAmount: this.bidAmount,
      jailTurns: this.jailTurns,
      isInJail: this.isInJail,
    };
    return clientPlayer;
  }

  clone() {
    const player = new Player(this.name, this.id);
    Object.assign(player, this);
    return player;
  }

  setPosition(position: number) {
    this.position = position;
    this.targetPosition = position;
  }
}
