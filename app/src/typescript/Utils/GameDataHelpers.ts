import type { IClientGameData } from '../models/shared/IClientGameData';
import type { IClientPlayer } from '../models/shared/IClientPlayer';

export class GameDataHelpers {
  static playerCanMortgage(player: IClientPlayer, gameData: IClientGameData) {
    const playerProperties = gameData.tiles.filter((p) => p.ownerId === player.id);
    const mortgageableProperties = playerProperties.filter((p) => !p.mortgaged);
    return mortgageableProperties.length > 0;
  }
}
