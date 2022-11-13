import type { IClientGameData } from '../models/shared/IClientGameData';
import type { IClientPlayer } from '../models/shared/IClientPlayer';

export class GameDataHelpers {
  static playerCanBuyBuilding(player: IClientPlayer, gameData: IClientGameData) {
    const playerProperties = gameData.tiles.filter((p) => p.ownerId === player.id);
    const buyableProperties = playerProperties.filter((p) => p.buildingCount || 0 < 5);
    return buyableProperties.length > 0;
  }

  static playerCanSellBuilding(player: IClientPlayer, gameData: IClientGameData) {
    const playerProperties = gameData.tiles.filter((p) => p.ownerId === player.id);
    const sellableProperties = playerProperties.filter((p) => p.buildingCount || 0 > 0);
    return sellableProperties.length > 0;
  }

  static playerCanUnmortgage(player: IClientPlayer, gameData: IClientGameData) {
    const playerProperties = gameData.tiles.filter((p) => p.ownerId === player.id);
    const mortgagedProperties = playerProperties.filter((p) => p.mortgaged);
    return mortgagedProperties.length > 0;
  }

  static playerCanMortgage(player: IClientPlayer, gameData: IClientGameData) {
    const playerProperties = gameData.tiles.filter((p) => p.ownerId === player.id);
    const mortgageableProperties = playerProperties.filter((p) => !p.mortgaged);
    return mortgageableProperties.length > 0;
  }
}
