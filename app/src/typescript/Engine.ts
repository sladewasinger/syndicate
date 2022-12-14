import { io, Socket } from 'socket.io-client';
import { Board } from './Renderables/Board';
import type { IClientGameData } from './models/shared/IClientGameData';
import type { IClientLobbyData } from './models/shared/IClientLobbyData';
import type { IClientUser } from './models/shared/IClientUser';
import { Utils } from './Utils/Utils';
import type { TradeOffer } from './models/shared/TradeOffer';
import type { BoardCallbacks } from './models/BoardCallbacks';

export class Engine {
  socket: Socket<any, any>;
  board: Board | undefined;
  gameData: IClientGameData | undefined;
  lobbyData: IClientLobbyData | undefined;
  myUser: IClientUser | undefined;
  lobbyId: string = '';
  connected: boolean = false;
  gameRunning: boolean = false;

  constructor(public vueForceUpdateCallback = () => {}, public createBoardOnGameStarted = true) {
    if (window.location.port == '3001') {
      this.socket = io('http://localhost:3000');
    } else {
      this.socket = io('https://syndicate.azurewebsites.net');
    }
    this.socket.on('connect', () => {
      console.log('connected');
      this.connected = true;
      this.vueForceUpdateCallback();
    });
    this.socket.on('disconnect', () => {
      console.log('disconnected');
      this.connected = false;
      this.vueForceUpdateCallback();
    });
    this.socket.on('lobbyData', (data: any) => {
      console.log('lobbyData', data);
      this.lobbyData = data;
      this.vueForceUpdateCallback();
    });
    this.socket.on('gameData', (gameData: any) => {
      console.log('gameData', gameData);
      if (!this.gameRunning) {
        this.gameRunning = true;
      }
      this.gameData = gameData;
      this.vueForceUpdateCallback();
    });
    this.socket.on('gameMessage', (message: any) => {
      console.log('gameMessage', message);
      this.board?.onGameMessage(message);
      this.vueForceUpdateCallback();
    });
    this.socket.on('gameStarted', async (gameData: IClientGameData) => {
      console.log('gameStarted');
      this.gameRunning = true;
      if (this.createBoardOnGameStarted && !this.board) {
        this.board = new Board(gameData, <BoardCallbacks>{
          rollDice: () => this.rollDice(),
          endTurn: () => this.endTurn(),
          buyProperty: () => this.buyProperty(),
          auctionProperty: () => this.auctionProperty(),
          auctionBid: (bidAmount: number) => this.placeAuctionBid(bidAmount),
          mortgageProperty: (tileIndex: number) => this.mortgageProperty(tileIndex),
          unmortgageProperty: (tileIndex: number) => this.unmortgageProperty(tileIndex),
          buyBuilding: (tileId: number) => this.buyBuilding(tileId),
          sellBuilding: (tileId: number) => this.sellBuilding(tileId),
          openTrades: () => {},
          openCreateTrade: () => {},
          createTrade: (tradeOffer: TradeOffer) => {
            this.createTradeOffer(tradeOffer);
          },
          acceptTrade: (tradeOfferId: string) => {
            this.acceptTradeOffer(tradeOfferId);
          },
          cancelTrade: (tradeOfferId: string) => {
            this.cancelTradeOffer(tradeOfferId);
          },
          declareBankruptcy: () => this.declareBankruptcy(),
        });
        await this.board.drawBoardInitial(gameData);
      }
    });

    window.requestAnimationFrame(this.update.bind(this));
  }

  get engineVueProperties() {
    return {
      connected: this.connected,
      myUser: this.myUser,
      gameData: this.gameData,
      lobbyData: this.lobbyData,
      lobbyId: this.lobbyId,
      gameRunning: this.gameRunning,
    };
  }

  update() {
    if (!this.gameData) {
      window.requestAnimationFrame(this.update.bind(this));
      return;
    }
    this.board?.update(this.gameData);
    window.requestAnimationFrame(this.update.bind(this));
  }

  registerName(name: string) {
    this.socket.emit('registerName', name, (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
        this.myUser = result;
        this.vueForceUpdateCallback();
      }
    });
  }

  createLobby(): void {
    this.socket.emit('createLobby', (error: any, result: IClientLobbyData) => {
      if (error) {
        console.error(error);
      } else {
        console.log('createLobby result', result);
        this.lobbyId = result.id;
        this.vueForceUpdateCallback();
      }
    });
  }

  joinLobby(lobbyId: string) {
    this.socket.emit('joinLobby', lobbyId, (error: any, result: IClientLobbyData) => {
      if (error) {
        console.error(error);
      } else {
        console.log('joinLobby result', result);
        this.lobbyId = result.id;
        this.vueForceUpdateCallback();
      }
    });
  }

  startGame() {
    this.socket.emit('startGame', async (error: any, result: IClientGameData) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
        this.gameData = result;
        this.gameRunning = true;
        // this.board = new Board(result);
        // await this.board.drawBoardInitial(result);
        this.vueForceUpdateCallback();
      }
    });
  }

  async rollDice(dice1Override: number | undefined = undefined, dice2Override: number | undefined = undefined) {
    Utils.emitWithPromise(this.socket, 'rollDice', dice1Override, dice2Override);
  }

  async buyProperty() {
    Utils.emitWithPromise(this.socket, 'buyProperty');
  }

  async auctionProperty() {
    await Utils.emitWithPromise(this.socket, 'auctionProperty');
  }

  async placeAuctionBid(bidAmount: number) {
    await Utils.emitWithPromise(this.socket, 'auctionBid', bidAmount);
  }

  async buyBuilding(tilePosition: number) {
    await Utils.emitWithPromise(this.socket, 'buyBuilding', tilePosition);
  }

  async sellBuilding(tileId: number) {
    await Utils.emitWithPromise(this.socket, 'sellBuilding', tileId);
  }

  async mortgageProperty(tileIndex: number) {
    await Utils.emitWithPromise(this.socket, 'mortgageProperty', tileIndex);
  }

  async unmortgageProperty(tileIndex: number) {
    await Utils.emitWithPromise(this.socket, 'unmortgageProperty', tileIndex);
  }

  async createTradeOffer(tradeOffer: TradeOffer) {
    await Utils.emitWithPromise(this.socket, 'createTradeOffer', tradeOffer);
  }

  async acceptTradeOffer(tradeOfferId: string) {
    await Utils.emitWithPromise(this.socket, 'acceptTradeOffer', tradeOfferId);
  }

  async cancelTradeOffer(tradeOfferId: string) {
    await Utils.emitWithPromise(this.socket, 'cancelTradeOffer', tradeOfferId);
  }

  async endTurn() {
    await Utils.emitWithPromise(this.socket, 'endTurn');
  }

  async declareBankruptcy() {
    await Utils.emitWithPromise(this.socket, 'declareBankruptcy');
  }
}
