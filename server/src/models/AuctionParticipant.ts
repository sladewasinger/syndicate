import { IClientAuctionParticipant } from './shared/IClientAuctionParticipant';
import { Player } from './Player';

export class AuctionParticipant {
  player: Player;
  bidAmount: number;
  hasBid: boolean;

  constructor(player: Player) {
    this.player = player;
    this.bidAmount = 0;
    this.hasBid = false;
  }

  get clientAuctionParticipant() {
    const clientAuctionParticipant: IClientAuctionParticipant = {
      id: this.player.id,
      name: this.player.name,
      color: this.player.color,
      turnOrder: this.player.turnOrder,
      hasBid: this.hasBid,
    };
    return clientAuctionParticipant;
  }
}
