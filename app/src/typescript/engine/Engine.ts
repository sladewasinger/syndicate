import { io, Socket } from 'socket.io-client';

export class Engine {
  socket: Socket<any, any>;
  port: string | number;

  constructor() {
    console.log('Engine constructor');
    this.port = 443;
    this.socket = io(`http://localhost:${this.port}`);
    this.socket.on('connect', () => {
      console.log('connected');
    });
  }

  start() {
    this.socket.emit('registerName', 'player1id', (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
  }
}
