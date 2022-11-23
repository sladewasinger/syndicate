import type { IClientGameData } from '../models/shared/IClientGameData';
import type { IClientPlayer } from '../models/shared/IClientPlayer';
import type { IClientTile } from '../models/shared/IClientTile';

export class GameDataHelpers {
  static playerCanBuyBuildingOnProperty(player: IClientPlayer, property: IClientTile, gameData: IClientGameData) {
    if (!property || property.ownerId !== player.id) {
      return false;
    }

    if (property.buildingCount == undefined || property.buildingCount >= 5) {
      return false;
    }

    const colorGroup = gameData.tiles
      .filter((p) => p.buildingCount != undefined)
      .filter((p) => p.color === property.color);

    const playerOwnedBuildablePropertiesInGroup = colorGroup.filter((p) => p.ownerId === player.id);
    if (playerOwnedBuildablePropertiesInGroup.length === colorGroup.length) {
      return true;
    }

    return false;
  }

  static playerCanBuyBuilding(player: IClientPlayer, gameData: IClientGameData) {
    const colorGroups = gameData.tiles
      .filter((p) => p.buildingCount != undefined)
      .reduce((map, p) => {
        if (!map[p.color]) {
          map[p.color] = [];
        }
        map[p.color].push(p);
        return map;
      }, {} as Record<number, IClientTile[]>);

    let canBuild = false;
    for (const colorGroup of Object.values(colorGroups)) {
      const playerOwnedBuildablePropertiesInGroup = colorGroup
        .filter((p) => p.ownerId === player.id)
        .filter((p) => p.buildingCount! < 5);
      if (playerOwnedBuildablePropertiesInGroup.length === colorGroup.length) {
        canBuild = true;
        break;
      }
    }
    return canBuild;
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
