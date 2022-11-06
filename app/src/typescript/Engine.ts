import { io, Socket } from 'socket.io-client';
import { Board } from './Renderables/Board';
import type { IClientGameData } from './models/shared/IClientGameData';

export class Engine {
  socket: Socket<any, any>;
  board: Board | undefined;
  gameData: IClientGameData | undefined;

  constructor() {
    if (window.location.port == '3001') {
      this.socket = io('http://localhost:3000');
    } else {
      this.socket = io('https://syndicate.azurewebsites.net');
    }
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('gameData', (gameData: any) => {
      console.log(gameData);
      this.gameData = gameData;
    });

    window.requestAnimationFrame(this.update.bind(this));
  }

  update() {
    if (!this.gameData) {
      window.requestAnimationFrame(this.update.bind(this));
      return;
    }
    this.board?.update(this.gameData);
    window.requestAnimationFrame(this.update.bind(this));
  }

  start() {
    this.socket.emit('startGame', async (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
        this.gameData = result;
        this.board = new Board(result);
        await this.board.drawBoardInitial(result);
      }
    });
  }

  rollDice(dice1Override: number | undefined = undefined, dice2Override: number | undefined = undefined) {
    this.socket.emit('rollDice', dice1Override, dice2Override, (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
  }

  buyProperty() {
    this.socket.emit('buyProperty', (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
  }

  endTurn() {
    this.socket.emit('endTurn', (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
  }
}
