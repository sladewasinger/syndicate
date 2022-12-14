import { StateMachine } from './StateMachine';
import { GameStart } from './states/GameStart';
import { PreDiceRoll } from './states/PreDiceRoll';
import { PostDiceRoll } from './states/PostDiceRoll';
import { TurnStart } from './states/TurnStart';
import { LandedOnTile } from './states/LandedOnTile';
import { GameData } from '../models/GameData';
import { StateEvent } from './states/StateEvents';
import { IBuildableTile, IBuyableTile } from 'src/models/tiles/ITile';
import { IClientGameData } from 'src/models/shared/IClientGameData';
import { Player } from 'src/models/Player';
import { GameOver } from './states/GameOver';
import { RollDice } from './states/RollDice';
import { BuyProperty } from './states/BuyProperty';
import { TurnEnd } from './states/TurnEnd';
import { IClientPlayer } from 'src/models/shared/IClientPlayer';
import { BuyBuilding } from './states/BuyBuilding';
import { SellBuilding } from './states/SellBuilding';
import { TradeOffer } from 'src/models/shared/TradeOffer';
import { randomUUID } from 'crypto';
import { MortgageProperty } from './states/MortgageProperty';
import { UnmortgageProperty } from './states/UnmortgageProperty';
import { AuctionProperty } from './states/AuctionProperty';
import { AuctionFinished } from './states/AuctionFinished';
import { InTraffic } from './states/InTraffic';
import { EnterTraffic } from './states/EnterTraffic';
import { EventTile } from '../models/tiles/EventTile';
import { EventState } from './states/EventState';

export type GameDataCallbacks = {
  onStateChange: (state: string) => void;
  onGameMessage: (message: string) => void;
};

export class Game {
  stateMachine: StateMachine;
  colors: number[] = [
    0xe6194b, // red
    0x3cb44b, // green
    0xffe119, // yellow
    0x4363d8, // blue
    0xf58231, // orange
    0x911eb4, // purple
    0x42d4f4, // cyan
    0xf032e6, // magenta
    0xbfef45, // lime
    0xfabeb4, // pink
    0x469990, // teal
    0xdcbeff, // lavender
    0x9a6324, // brown
    0x800000, // maroon
    0xaaffc3, // mint
    0x808000, // olive
    0xffd8b1, // beige
    0x000075, // navy
    0xa9a9a9, // grey
    0xfffac8, // cream
  ];

  constructor(players: Player[], callbacks: GameDataCallbacks) {
    const gameData = new GameData(callbacks);
    gameData.players = players;

    this.stateMachine = new StateMachine(new TurnStart(), gameData);
    this.stateMachine.addState(new GameStart());
    this.stateMachine.addState(new TurnStart());
    this.stateMachine.addState(new PreDiceRoll());
    this.stateMachine.addState(new RollDice());
    this.stateMachine.addState(new PostDiceRoll());
    this.stateMachine.addState(new LandedOnTile());
    this.stateMachine.addState(new BuyProperty());
    this.stateMachine.addState(new AuctionProperty());
    this.stateMachine.addState(new AuctionFinished());
    this.stateMachine.addState(new BuyBuilding());
    this.stateMachine.addState(new SellBuilding());
    this.stateMachine.addState(new MortgageProperty());
    this.stateMachine.addState(new UnmortgageProperty());
    this.stateMachine.addState(new TurnEnd());
    this.stateMachine.addState(new GameOver());
    this.stateMachine.addState(new InTraffic());
    this.stateMachine.addState(new EnterTraffic());
    this.stateMachine.addState(new EventState());
  }

  async tick() {
    // I know this is nasty code. Don't judge me... I'm in a hurry.
    const prevGameData = JSON.stringify(this.stateMachine);

    this.stateMachine.update();

    if (prevGameData !== JSON.stringify(this.stateMachine)) {
      this.stateMachine.gameData.callbacks.onStateChange(this.stateMachine.currentState.name);
    }
  }

  getClientGameData(playerId: string): IClientGameData {
    const clientGameData: IClientGameData = {
      myId: playerId,
      players: this.stateMachine.gameData.players.map((p) => p.clientPlayer),
      dice: this.stateMachine.gameData.dice,
      currentPlayer: this.stateMachine.gameData.currentPlayer?.clientPlayer,
      tiles: this.stateMachine.gameData.tiles.map((t) => t.getClientTile(this.stateMachine.gameData)),
      state: this.stateMachine.currentState.name,
      lastSelectedTilePosition: this.stateMachine.gameData.lastSelectedTilePosition,
      tradeOffers: this.stateMachine.gameData.tradeOffers,
      auctionParticipants: this.stateMachine.gameData.auction?.bidders.map((p) => p.clientAuctionParticipant) || [],
      auctionWinner: this.stateMachine.gameData.auction?.highestBidder?.player.clientPlayer,
      log: [...this.stateMachine.gameData.getLog()].reverse().slice(0, 5),
    };
    return clientGameData;
  }

  getPlayers() {
    return this.stateMachine.gameData.players;
  }

  removePlayer(playerId: string) {
    const player = this.stateMachine.gameData.players.find((p) => p.id === playerId);
    if (player) {
      const ownedProperties = this.stateMachine.gameData.tiles
        .filter((t) => t.buyable)
        .map((t) => t as IBuyableTile)
        .filter((t) => t.owner?.id === playerId);
      for (const property of ownedProperties) {
        property.owner = undefined;
        property.mortgaged = false;
      }
      this.stateMachine.gameData.players = this.stateMachine.gameData.players.filter((p) => p.id !== playerId);
      if (this.stateMachine.gameData.players.length === 1) {
        this.stateMachine.setState('GameOver');
      } else if (player === this.stateMachine.gameData.currentPlayer) {
        this.stateMachine.setState('TurnStart');
      }
      this.stateMachine.gameData.log(`${player.name} left the game.`);
    }
  }

  startGame() {
    for (let i = 0; i < this.stateMachine.gameData.players.length; i++) {
      const player = this.stateMachine.gameData.players[i];
      const color = this.colors[i % this.colors.length];
      this.resetPlayer(player, color);
      player.turnOrder = i;
    }
  }

  addPlayer(player: Player) {
    this.resetPlayer(player, this.colors[this.stateMachine.gameData.players.length % this.colors.length]);
    this.stateMachine.gameData.players.push(player);
  }

  private resetPlayer(player: Player, color: number) {
    player.money = 1500;
    player.position = 0;
    player.properties = [];
    player.color = color;
  }

  rollDice(dice1Override: number | undefined = undefined, dice2Override: number | undefined = undefined) {
    console.log('Game - rollDice');
    if (dice1Override === undefined || dice1Override == null || dice2Override == undefined || dice2Override == null) {
      this.stateMachine.gameData.diceOverride = null;
    } else {
      console.log('Game - rollDice - override dice', dice1Override, dice2Override);
      this.stateMachine.gameData.diceOverride = [dice1Override, dice2Override];
    }
    this.stateMachine.event(StateEvent.RollDice);
  }

  buyProperty() {
    this.stateMachine.event(StateEvent.BuyProperty);
    this.tick();
  }

  auctionProperty() {
    this.stateMachine.event(StateEvent.AuctionProperty);
    this.tick();
  }

  auctionBid(playerId: string, bid: number) {
    if (this.stateMachine.gameData.auction) {
      this.stateMachine.gameData.auction.bid(playerId, bid, this.stateMachine.gameData);
      this.stateMachine.gameData.callbacks.onStateChange(this.stateMachine.currentState.name);
    }
  }

  buyBuilding(tilePosition: number) {
    this.stateMachine.gameData.lastSelectedTilePosition = tilePosition;
    this.stateMachine.event(StateEvent.BuyBuilding);
    this.tick();
  }

  sellBuilding(tilePosition: number) {
    this.stateMachine.gameData.lastSelectedTilePosition = tilePosition;
    this.stateMachine.event(StateEvent.SellBuilding);
    this.tick();
  }

  mortgageProperty(tilePosition: number) {
    this.stateMachine.gameData.lastSelectedTilePosition = tilePosition;
    this.stateMachine.event(StateEvent.MortgageProperty);
    this.tick();
  }

  unmortgageProperty(tilePosition: number) {
    this.stateMachine.gameData.lastSelectedTilePosition = tilePosition;
    this.stateMachine.event(StateEvent.UnmortgageProperty);
    this.tick();
  }

  endTurn() {
    this.stateMachine.event(StateEvent.EndTurn);
    this.tick();
  }

  declareBankruptcy(playerId: string) {
    this.stateMachine.gameData.log(`${this.stateMachine.gameData.currentPlayer?.name} declared bankruptcy.`);
    this.removePlayer(playerId);
    this.stateMachine.gameData.callbacks.onStateChange(this.stateMachine.currentState.name);
  }

  createTradeOffer(offer: TradeOffer) {
    offer.id = randomUUID();
    this.stateMachine.gameData.tradeOffers.push(offer);
    this.stateMachine.gameData.callbacks.onStateChange(this.stateMachine.currentState.name);
  }

  acceptTradeOffer(id: string) {
    try {
      const offer = this.stateMachine.gameData.tradeOffers.find((o) => o.id === id);
      if (!offer) {
        console.error('Game - acceptTradeOffer - offer not found', id);
        return;
      }

      const author = this.stateMachine.gameData.players.find((p) => p.id === offer.authorPlayerId);
      if (!author) {
        this.stateMachine.gameData.tradeOffers = this.stateMachine.gameData.tradeOffers.filter((o) => o.id !== id);
        console.error('Game - acceptTradeOffer - author player not found', offer.authorPlayerId);
        return;
      }

      const target = this.stateMachine.gameData.players.find((p) => p.id === offer.targetPlayerId);
      if (!target) {
        this.stateMachine.gameData.tradeOffers = this.stateMachine.gameData.tradeOffers.filter((o) => o.id !== id);
        console.error('Game - acceptTradeOffer - target player not found', offer.targetPlayerId);
        return;
      }

      const authorProperties = offer.authorOfferProperties.map((p) =>
        this.stateMachine.gameData.tiles.find((t) => t.id === p.id)
      );
      if (authorProperties.some((p) => p === undefined)) {
        this.stateMachine.gameData.tradeOffers = this.stateMachine.gameData.tradeOffers.filter((o) => o.id !== id);
        console.error('Game - acceptTradeOffer - author property or properties not found', offer.authorOfferProperties);
        return;
      }

      if (authorProperties.map((p) => p as IBuyableTile).some((p) => !p?.buyable || p?.owner?.id !== author.id)) {
        this.stateMachine.gameData.tradeOffers = this.stateMachine.gameData.tradeOffers.filter((o) => o.id !== id);
        console.error(
          'Game - acceptTradeOffer - author property or properties not owned by author',
          offer.authorOfferProperties
        );
        return;
      }

      const targetProperties = offer.targetOfferProperties.map((p) =>
        this.stateMachine.gameData.tiles.find((t) => t.id === p.id)
      );
      if (targetProperties.some((p) => p === undefined)) {
        this.stateMachine.gameData.tradeOffers = this.stateMachine.gameData.tradeOffers.filter((o) => o.id !== id);
        console.error('Game - acceptTradeOffer - target property or properties not found', offer.targetOfferProperties);
        return;
      }

      if (targetProperties.map((p) => p as IBuyableTile).some((p) => !p?.buyable || p?.owner?.id !== target.id)) {
        this.stateMachine.gameData.tradeOffers = this.stateMachine.gameData.tradeOffers.filter((o) => o.id !== id);
        console.error(
          'Game - acceptTradeOffer - target property or properties not owned by target',
          offer.targetOfferProperties
        );
        return;
      }

      if (author.money < offer.authorOfferMoney) {
        this.stateMachine.gameData.log(
          `${author.name} does not have enough money ($${offer.authorOfferMoney}) for this trade`
        );
        return;
      }

      if (target.money < offer.targetOfferMoney) {
        this.stateMachine.gameData.log(
          `${target.name} does not have enough money ($${offer.targetOfferMoney}) for this trade`
        );
        return;
      }

      for (const property of authorProperties) {
        const buyableProperty = property as IBuyableTile;
        if (buyableProperty?.buyable) {
          buyableProperty.owner = target;
        }
      }

      for (const property of targetProperties) {
        const buyableProperty = property as IBuyableTile;
        if (buyableProperty?.buyable) {
          buyableProperty.owner = author;
        }
      }

      author.money -= offer.authorOfferMoney;
      author.money += offer.targetOfferMoney;

      target.money -= offer.targetOfferMoney;
      target.money += offer.authorOfferMoney;

      this.stateMachine.gameData.tradeOffers = this.stateMachine.gameData.tradeOffers.filter((o) => o.id !== id);
      this.stateMachine.gameData.log(`${target.name} accepted trade offer from ${author.name}`);
    } finally {
      this.stateMachine.gameData.callbacks.onStateChange(this.stateMachine.currentState.name);
    }
  }

  cancelTradeOffer(offerId: string) {
    this.stateMachine.gameData.tradeOffers = this.stateMachine.gameData.tradeOffers.filter((o) => o.id !== offerId);
    this.stateMachine.gameData.callbacks.onStateChange(this.stateMachine.currentState.name);
  }
}
