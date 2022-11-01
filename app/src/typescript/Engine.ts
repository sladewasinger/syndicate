import { io, Socket } from 'socket.io-client';
import { Board } from './Board';
import type { IClientGameData } from './models/IClientGameData';

export class Engine {
  socket: Socket<any, any>;
  board: Board;
  gameData: IClientGameData | undefined;

  constructor() {
    this.board = new Board();

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
  }

  start() {
    this.socket.emit('registerName', 'player1name', (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
    this.socket.emit('createLobby', (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
    this.socket.emit('startGame', (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
        this.board.drawBoardInitial(result);
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
