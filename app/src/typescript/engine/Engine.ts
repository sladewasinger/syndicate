import { io, Socket } from 'socket.io-client';
import { Board } from './Board';

export class Engine {
  socket: Socket<any, any>;
  board: Board;
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
  }

  start() {
    this.board.drawBoardInitial();
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
