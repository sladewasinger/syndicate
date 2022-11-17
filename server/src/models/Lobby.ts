import { randomUUID } from 'crypto';
import type { Server } from 'socket.io';
import { Game } from '../game/Game';
import type { InterServerEvents } from './io/InterServerEvents';
import { ClientToServerEvents } from './shared/ClientToServerEvents';
import { IClientLobbyData } from './shared/IClientLobbyData';
import { Player } from './Player';
import { ServerToClientEvents } from './shared/ServerToClientEvents';
import { SocketData } from './shared/SocketData';
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
          this.emitGameData();
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

  get clientLobbyData() {
    const clientLobbyData: IClientLobbyData = {
      id: this.id,
      users: this.users.map((u) => u.clientUser),
      owner: this.owner?.clientUser,
    };
    return clientLobbyData;
  }

  emitGameData() {
    if (!!this.game) {
      for (const user of this.users) {
        const gameData = this.game.getClientGameData(user.socketId);
        this.io?.to(user.socketId).emit('gameData', gameData);
      }
    }
  }
}
