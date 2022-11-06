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
        this.board = new Board();
        await this.board.drawBoardInitial(result);
      }
    });
  }

  rollDice() {
    this.socket.emit('rollDice', (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
  }
}
