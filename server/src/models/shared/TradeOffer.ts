import { IClientUser } from './IClientUser';

export class TradeOfferProperty {
  constructor(public name: string, public color: number, public id: string) {}
}

export class TradeOffer {
  id: string = '';

  constructor(
    public authorPlayerId: string,
    public targetPlayerId: string,
    public authorOfferProperties: TradeOfferProperty[],
    public authorOfferMoney: number,
    public targetOfferProperties: TradeOfferProperty[],
    public targetOfferMoney: number
  ) {}
}
