import { GameData } from '../GameData';
import { StateName } from '../shared/StateNames';
import { TileType } from '../shared/TileType';
import { DistrictTile } from '../tiles/DistrictTile';
import { IBuildableTile, IBuyableTile } from '../tiles/ITile';
import { UtilityTile } from '../tiles/UtilityTile';

export interface EventCard {
  id: string;
  title: string;
  description: string;
  execute: (gameData: GameData) => StateName;
}

export class GoToStart_Event {
  id = 'goToStart';
  title = 'Go to Start';
  description = 'Go directly to Start. Collect $200.';

  execute = (gameData: GameData) => {
    gameData.currentPlayer.setPosition(0);
    gameData.currentPlayer.money += 200;

    return StateName.TurnEnd;
  };
}

export class GoToJail_Event {
  id = 'goToJail';
  title = 'Go to Jail';
  description = 'Enter traffic!';

  execute = (gameData: GameData) => {
    gameData.currentPlayer.setPosition(10);
    gameData.currentPlayer.isInJail = true;
    gameData.currentPlayer.jailTurns = 3;

    return StateName.TurnEnd;
  };
}

export class SwapPositionWithAnotherPlayer_Event {
  id = 'swapPlayerPositions';
  title = 'Swap Player Positions';
  description = 'Swap positions with another player.';

  execute = (gameData: GameData) => {
    const otherPlayers = gameData.players.filter((p) => p.id !== gameData.currentPlayer.id);
    if (otherPlayers.length === 0) {
      return StateName.TurnEnd;
    }
    const otherPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    const tempPosition = gameData.currentPlayer.position;
    gameData.currentPlayer.setPosition(otherPlayer.position);
    otherPlayer.setPosition(tempPosition);

    return StateName.TurnEnd;
  };
}

export class PayTaxesOnAllProperties_Event {
  id = 'payTaxesOnAllProperties';
  title = 'Pay Taxes on All Properties';
  description = 'Pay $25 for each property you own.';

  execute = (gameData: GameData) => {
    const ownedProperties = gameData.tiles.filter((tile) => tile.owner?.id === gameData.currentPlayer.id);
    gameData.currentPlayer.money -= ownedProperties.length * 25;

    return StateName.TurnEnd;
  };
}

export class PayTaxesOnAllHouses_Event {
  id = 'payTaxesOnAllHouses';
  title = 'Pay Taxes on All Houses';
  description = 'Pay $50 for each house/skyscraper you own.';

  execute = (gameData: GameData) => {
    const ownedProperties = gameData.tiles
      .filter((tile) => tile.owner?.id === gameData.currentPlayer.id)
      .map((tile) => tile as IBuildableTile)
      .filter((tile) => tile.buildingCount != undefined)
      .filter((tile) => tile.buildingCount > 0);
    const houses = ownedProperties.map((tile) => tile.buildingCount).reduce((a, b) => a + b, 0);
    gameData.currentPlayer.money -= houses * 50;

    return StateName.TurnEnd;
  };
}

export class GoToInternetCompany_Event {
  id = 'goToInternetCompany';
  title = 'Go to Internet Company';
  description = 'Go directly to Internet Company.';

  execute = (gameData: GameData) => {
    const internetCompanyIndex = gameData.tiles.findIndex(
      (t) => t instanceof UtilityTile && t.type == TileType.Internet
    );
    if (internetCompanyIndex == -1) {
      return StateName.TurnEnd;
    }
    gameData.currentPlayer.setPosition(internetCompanyIndex);

    return StateName.LandedOnTile;
  };
}

export class GoTo39thStreet_Event {
  id = 'goTo39thStreet';
  title = 'Go to 39th Street';
  description = 'Go directly to 39th Street.';

  execute = (gameData: GameData) => {
    const targetTileIndex = 39;
    gameData.currentPlayer.setPosition(targetTileIndex);

    return StateName.LandedOnTile;
  };
}

export class GoToElectricCompany_Event {
  id = 'goToElectricCompany';
  title = 'Go to Electric Company';
  description = 'Go directly to Electric Company.';

  execute = (gameData: GameData) => {
    const electricCompanyIndex = gameData.tiles.findIndex(
      (t) => t instanceof UtilityTile && t.type == TileType.Electric
    );
    if (electricCompanyIndex == -1) {
      return StateName.TurnEnd;
    }
    gameData.currentPlayer.setPosition(electricCompanyIndex);

    return StateName.LandedOnTile;
  };
}

export class GoTo18thStreet_Event {
  id = 'goTo18thStreet';
  title = 'Go to 18th Street';
  description = 'Go directly to 18th Street.';

  execute = (gameData: GameData) => {
    const targetTileIndex = 18;
    gameData.currentPlayer.setPosition(targetTileIndex);

    return StateName.LandedOnTile;
  };
}

export class GoTo1stStreet_Event {
  id = 'goTo1stStreet';
  title = 'Go to 1st Street';
  description = 'Go directly to 1st Street.';

  execute = (gameData: GameData) => {
    const targetTileIndex = 1;
    gameData.currentPlayer.setPosition(targetTileIndex);

    return StateName.LandedOnTile;
  };
}

export class GoTo34thStreet_Event {
  id = 'goTo1stStreet';
  title = 'Go to 1st Street';
  description = 'Go directly to 34th Street.';

  execute = (gameData: GameData) => {
    const targetTileIndex = 34;
    gameData.currentPlayer.setPosition(targetTileIndex);

    return StateName.LandedOnTile;
  };
}

export class BankErrorInFavor_Event {
  id = 'bankErrorInFavor';
  title = 'Bank Error in Your Favor';
  description = 'Bank error in your favor. Collect $200.';

  execute = (gameData: GameData) => {
    gameData.currentPlayer.money += 200;

    return StateName.TurnEnd;
  };
}

export class DoctorsFees_Event {
  id = 'doctorsFees';
  title = "Doctor's Fees";
  description = "Pay $50. You're sick.";

  execute = (gameData: GameData) => {
    gameData.currentPlayer.money -= 50;

    return StateName.TurnEnd;
  };
}

export class IncomeTaxRefund_Event {
  id = 'incomeTaxRefund';
  title = 'Income Tax Refund';
  description = 'You got a refund. Collect $100.';
  execute = (gameData: GameData) => {
    gameData.currentPlayer.money += 100;

    return StateName.TurnEnd;
  };
}
