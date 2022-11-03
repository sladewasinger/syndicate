import { randomUUID } from 'crypto';
import type { Server } from 'socket.io';
import { Game } from '../game/Game';
import type { ClientToServerEvents } from './io/ClientToServerEvents';
import type { InterServerEvents } from './io/InterServerEvents';
import type { ServerToClientEvents } from './io/ServerToClientEvents';
import type { SocketData } from './io/SocketData';
import { Player } from './shared/Player';
import type { User } from './User';

export class Lobby {
  id: string;
  users: User[] = [];
  owner: User | null = null;
  game: Game | null = null;

  constructor() {
    this.id = randomUUID().substring(0, 4).toUpperCase();
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

      this.game?.removePlayer(user.socketId);
    }
  }

  startGame(io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    if (this.game) {
      return;
    }
    this.game = new Game(this.users.map((u) => new Player(u.name || u.socketId.substring(0, 4), u.socketId)));
    this.game.startGame();

    this.users.forEach((user) => {
      io.to(user.socketId).emit('startGame');
    });
  }
}
