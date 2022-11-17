import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';
import { IBuyableTile } from '../../models/tiles/ITile';

export class AuctionFinished implements IGameState {
  name: StateName = StateName.AuctionFinished;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {
    const auction = gameData.auction;
    const tile = gameData.currentTile;
    const buyableTile = tile as IBuyableTile;

    if (auction && auction.highestBidder) {
      const player = auction.highestBidder.player;
      player.money -= auction.highestBid;
      player.properties.push(tile.id);
      tile.owner = player;
      gameData.log(`${player.name} won the auction and bought ${tile.name} for $${auction.highestBid}`);
    } else {
      gameData.log('No one bought this property');
    }

    this.nextState = StateName.TurnEnd;
  }

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
