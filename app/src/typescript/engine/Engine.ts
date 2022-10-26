import { io, Socket } from 'socket.io-client';

export class Engine {
  socket: Socket<any, any>;

  constructor() {
    console.log('Engine constructor');
    console.log(window.location.port);
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
}
