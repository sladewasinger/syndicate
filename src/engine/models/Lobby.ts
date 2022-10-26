import crypto from 'crypto';
import { Server } from 'socket.io';
import { Game } from '../../game/Game';
import { Player } from '../../game/models/Player';
import { ClientToServerEvents } from '../io/ClientToServerEvents';
import { InterServerEvents } from '../io/InterServerEvents';
import { ServerToClientEvents } from '../io/ServerToClientEvents';
import { SocketData } from '../io/SocketData';
import { User } from './User';

export class Lobby {
  id: string;
  users: User[] = [];
  owner: User | null = null;
  game: Game | null = null;

  constructor() {
    this.id = crypto.randomUUID().substring(0, 4).toUpperCase();
  }

  addUser(user: User) {
    this.users.push(user);
    if (!this.owner) {
      this.owner = user;
    }
  }

  removeUser(user: User) {
    const foundUser = this.users.find((u) => u.socketId === user.socketId);
    if (foundUser) {
      this.users = this.users.filter((u) => u.socketId !== user.socketId);
      if (this.owner?.socketId === user.socketId) {
        this.owner = this.users[0] || null;
      }
    }
  }

  startGame(io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    if (this.game) {
      return;
    }
    this.game = new Game(this.users.map((u) => new Player(u.name || u.socketId.substring(0, 4), u.socketId)));

    this.users.forEach((user) => {
      io.to(user.socketId).emit('startGame');
    });
  }
}
