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
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | undefined;

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    this.id = randomUUID().substring(0, 4).toUpperCase();
    this.io = io;
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

    this.game = new Game(
      this.users.map((u) => new Player(u.name || u.socketId.substring(0, 4), u.socketId)),
      {
        onStateChange: (name) => {
          console.log('onStateChange', name);
          this.emitGameState();
        },
      }
    );
    this.game.startGame();

    this.users.forEach((user) => {
      io.to(user.socketId).emit('startGame');
    });

    setInterval(() => {
      this.game?.tick();
    }, 250);
  }

  emitGameState() {
    if (!!this.game) {
      this.users.forEach((user) => {
        const gameData = this.game?.getClientGameData(user.socketId);
        this.io?.to(user.socketId).emit('gameData', gameData);
      });
    }
  }
}
