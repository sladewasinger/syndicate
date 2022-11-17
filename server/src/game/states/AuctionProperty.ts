import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { IBuyableTile } from '../../models/tiles/ITile';
import { Auction } from '../../models/Auction';

export class AuctionProperty implements IGameState {
  name: StateName = StateName.AuctionProperty;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {
    const tilePosition = gameData.currentPlayer.position;
    const tile = gameData.tiles[tilePosition] as IBuyableTile;
    if (!tile || tile.owner || tile.price == undefined) {
      gameData.log('Cannot auction this tile');
      return;
    }

    gameData.auction = new Auction(gameData.players);

    gameData.log(`Player ${gameData.currentPlayer.name} started a blind auction on ${tile.name}.`);
  }

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    if (gameData.auction && gameData.auction.isFinished()) {
      return StateName.AuctionFinished;
    }

    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
