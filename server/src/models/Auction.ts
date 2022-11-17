import { AuctionParticipant } from './AuctionParticipant';
import { GameData } from './GameData';
import { Player } from './Player';

export class Auction {
  bidders: AuctionParticipant[];
  highestBid: number = 0;
  highestBidder: AuctionParticipant | undefined = undefined;

  constructor(players: Player[]) {
    this.bidders = players.map((player) => new AuctionParticipant(player));
  }

  bid(playerId: string, bidAmount: number, gameData: GameData) {
    const bidder = this.bidders.find((b) => b.player.id === playerId);
    if (!bidder) {
      gameData.log(`Bidder ${playerId} not found`);
      return;
    }

    bidder.bidAmount = bidAmount;
    bidder.hasBid = true;

    if (bidAmount > this.highestBid) {
      this.highestBid = bidAmount;
      this.highestBidder = bidder;
    }

    console.log(`${bidder.player.name} bids ${bidAmount}`);
  }

  isFinished() {
    return this.bidders.every((bidder) => bidder.hasBid);
  }
}
