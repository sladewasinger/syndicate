import { randomUUID } from 'crypto';
import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import { ITile } from './ITile';
import { StateName } from '../shared/StateNames';

export class EventTile implements ITile {
  name: string = 'Event';
  id: string;
  owner: Player | undefined;
  buyable: boolean = false;
  type: TileType = TileType.Event;

  constructor() {
    this.id = randomUUID();
  }

  onLanded(gameData: GameData, currentState: StateName): StateName {
    const eventCard = gameData.eventCards.pop();
    if (eventCard) {
      gameData.eventCards.unshift(eventCard);
      eventCard.execute(gameData);
      gameData.log(`Event: ${gameData.currentPlayer.name} - ${eventCard.description}`);
      gameData.callbacks.onGameMessage(`Event: ${eventCard.description}`);
    }
    return StateName.TurnEnd;
  }

  getClientTile(gameData: GameData): IClientTile {
    const clientTile: IClientTile = {
      id: this.id,
      name: this.name,
      color: 0x000000,
      buyable: this.buyable,
      type: this.type,
      ownerId: this.owner?.id,
      mortgaged: false,
      price: undefined,
      mortgageValue: undefined,
      skyscraper: undefined,
      rent: undefined,
      entranceFees: undefined,
      buildingCost: undefined,
      skyscraperPrice: undefined,
      buildingCount: undefined,
    };
    return clientTile;
  }
}
