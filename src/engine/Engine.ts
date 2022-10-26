import express from 'express';
import { Server } from 'socket.io';
import { Lobby } from './models/Lobby';
import { User } from './models/User';
import { createServer } from 'http';
import { ClientToServerEvents } from './io/ClientToServerEvents';
import { InterServerEvents } from './io/InterServerEvents';
import { SocketData } from './io/SocketData';
import { ServerToClientEvents } from './io/ServerToClientEvents';
import { SocketError } from './io/SocketError';

export class Engine {
  port: string | number;
  lobbies: Lobby[] = [];
  users: User[] = [];
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | undefined;

  constructor() {
    // Use the port that AWS provides or default to 3000. Without this, the deployment will fail:
    this.port = process.env.PORT || 3000;
  }

  start() {
    const app = express();
    app.use(express.static('app'));

    const server = createServer(app);
    server.listen(this.port, () => {
      console.log(`socket io server listening on *:${this.port}`);
    });

    this.io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

    this.io.on('connection', (socket) => {
      this.createUser(socket.id);

      socket.on('disconnect', () => {
        console.log('user disconnected');
        this.removeUser(socket.id);
      });

      socket.on('registerName', (name, callback) => {
        console.log(`registerName: ${name}`);
        this.registerName(socket.id, name, callback);
      });

      socket.on('createLobby', (callback) => {
        console.log('createLobby');
        this.createLobby(socket.id, callback);
      });

      socket.on('joinLobby', (key, callback) => {
        console.log(`joinLobby: ${key}`);
        this.joinLobby(socket.id, key, callback);
      });
    });
  }

  createUser(socketId: string) {
    const user = new User(socketId);
    this.users.push(user);
    return user;
  }

  removeUser(socketId: string) {
    const user = this.users.find((u) => u.socketId === socketId);
    if (user) {
      this.lobbies.forEach((lobby) => {
        lobby.removeUser(user);
      });
    }
    this.users = this.users.filter((u) => u.socketId !== socketId);
  }

  registerName(socketId: string, name: string, callback: (error: SocketError | null, data: string) => void) {
    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      this.createUser(socketId);
    } else {
      user.name = name;
    }
    callback(null, name);
  }

  createLobby(socketId: string, callback: (error: SocketError | null, data: string) => void) {
    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      callback({ code: 'user_not_found', message: 'User not found' }, '');
      return;
    }
    const lobby = new Lobby();
    this.lobbies.push(lobby);
    lobby.addUser(user);
    callback(null, lobby.id);
  }

  joinLobby(socketId: string, key: string, callback: (error: SocketError | null, data: string) => void) {
    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      callback({ code: 'user_not_found', message: 'User not found' }, '');
      return;
    }

    const lobby = this.lobbies.find((l) => l.id.toUpperCase() === key.toUpperCase());
    if (!lobby) {
      callback({ code: 'lobby_not_found', message: 'Lobby not found' }, '');
      return;
    }

    lobby.users.push(user);
    callback(null, key);
  }
}
