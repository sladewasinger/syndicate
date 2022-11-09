import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Lobby } from '../models/Lobby';
import { User } from '../models/User';
import { InterServerEvents } from '../models/io/InterServerEvents';
import { IClientGameData } from 'src/models/shared/IClientGameData';
import { ClientToServerEvents } from 'src/models/shared/ClientToServerEvents';
import { ServerToClientEvents } from 'src/models/shared/ServerToClientEvents';
import { SocketData } from 'src/models/shared/SocketData';
import { SocketError } from 'src/models/shared/SocketError';
import { IClientLobbyData } from 'src/models/shared/IClientLobbyData';
import { IClientUser } from 'src/models/shared/IClientUser';

export class Engine {
  port: string | number;
  lobbies: Lobby[] = [];
  users: User[] = [];
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | undefined;
  cheatsEnabled: boolean = true;

  constructor() {
    // Use the port that Azure provides or default to 3000. Without this, the deployment will fail:
    // Should be 8080 in Azure
    this.port = process.env.PORT || 3000;
  }

  start() {
    const app = express();
    //const path = __dirname + '/app/';
    app.use(express.static('app'));

    const server = createServer(app);
    server.listen(this.port, () => {
      console.log(`socket io server listening on *:${this.port}`);
    });

    this.io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
      cors: {
        origin: '*', // TODO: Change this to localhost:&& syndicate.azurewebsites.net
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      console.log(`a user connected: ${socket.id}`);
      this.createUser(socket.id);

      socket.on('disconnect', () => {
        console.log(`a user disconnected: ${socket.id}`);
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
        console.log(`joinLobby: ${key}`, key);
        this.joinLobby(socket.id, key, callback);
      });

      socket.on('startGame', (callback) => {
        console.log('startGame');
        this.startGame(socket.id, callback);
      });

      socket.on('rollDice', (dice1Override, dice2Override, callback) => {
        console.log('rollDice');
        this.rollDice(socket.id, dice1Override, dice2Override, callback);
      });

      socket.on('buyProperty', (callback) => {
        console.log('buyProperty');
        this.buyProperty(socket.id, callback);
      });

      socket.on('endTurn', (callback) => {
        console.log('endTurn');
        this.endTurn(socket.id, callback);
      });

      socket.on('buyBuilding', (propertyIndex, callback) => {
        console.log('buyBuilding');
        this.buyBuilding(socket.id, propertyIndex, callback);
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
    const lobby = this.lobbies.find((l) => l.users.find((u) => u.socketId === socketId));
    if (user && lobby) {
      lobby.removeUser(user);
      if (lobby.users.length === 0) {
        this.lobbies = this.lobbies.filter((l) => l !== lobby);
      } else {
        lobby.emitGameData();
      }
    }
    this.users = this.users.filter((u) => u.socketId !== socketId);
  }

  registerName(
    socketId: string,
    name: string,
    callback: (error: SocketError | null, data: IClientUser | undefined) => void
  ) {
    callback = callback || (() => {});

    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      this.createUser(socketId);
    } else {
      user.name = name;
    }

    this.emitLobbyData();
    callback(null, user?.clientUser);
  }

  createLobby(socketId: string, callback: (error: SocketError | null, data: IClientLobbyData | null) => void) {
    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      callback({ code: 'user_not_found', message: 'User not found' }, null);
      return;
    }
    const lobby = new Lobby(this.io!);
    this.lobbies.push(lobby);
    lobby.addUser(user);

    this.emitLobbyData();
    callback(null, lobby.clientLobbyData);
  }

  joinLobby(
    socketId: string,
    key: string,
    callback: (error: SocketError | null, data: IClientLobbyData | null) => void
  ) {
    callback = callback || (() => {});
    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      callback({ code: 'user_not_found', message: 'User not found' }, null);
      return;
    }

    if (!key || key.length === 0 || typeof key !== 'string') {
      callback({ code: 'missing_key', message: 'Missing key' }, null);
      return;
    }

    const lobby = this.lobbies.find((l) => l.id.toUpperCase() === key.toUpperCase());
    if (!lobby) {
      callback({ code: 'lobby_not_found', message: 'Lobby not found' }, null);
      return;
    }

    lobby.addUser(user);

    this.emitLobbyData();
    callback(null, lobby.clientLobbyData);
  }

  startGame(socketId: string, callback: (error: SocketError | null, data: IClientGameData | null) => void) {
    callback = callback || (() => {});

    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      callback({ code: 'user_not_found', message: 'User not found' }, null);
      return;
    }

    const lobby = this.lobbies.find((l) => l.users.find((u) => u.socketId === socketId));
    if (!lobby) {
      callback({ code: 'lobby_not_found', message: 'Lobby not found' }, null);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lobby.startGame(this.io!);
    if (!lobby.game) {
      callback({ code: 'game_not_found', message: 'Game not found' }, null);
      return;
    }

    for (const user of lobby.users) {
      this.io?.to(user.socketId).emit('gameStarted', lobby.game.getClientGameData(user.socketId));
    }
    callback(null, lobby.game.getClientGameData(socketId));
  }

  rollDice(
    socketId: string,
    dice1Override: number | undefined,
    dice2Override: number | undefined,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) {
    callback = callback || (() => {});

    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      callback({ code: 'user_not_found', message: 'User not found' }, null);
      return;
    }

    const lobby = this.lobbies.find((l) => l.users.find((u) => u.socketId === socketId));
    if (!lobby) {
      callback({ code: 'lobby_not_found', message: 'Lobby not found' }, null);
      return;
    }

    if (!lobby.game) {
      callback({ code: 'game_not_found', message: 'Game not found' }, null);
      return;
    }

    if (!this.cheatsEnabled) {
      dice1Override = undefined;
      dice2Override = undefined;
    }

    lobby.game.rollDice(dice1Override, dice2Override);

    callback(null, lobby.game.getClientGameData(socketId));
  }

  buyProperty(socketId: string, callback: (error: SocketError | null, data: IClientGameData | null) => void) {
    callback = callback || (() => {});

    const result = this.getUserLobbyGame(socketId, callback);
    if (!result) {
      return;
    }
    const { user, lobby } = result;

    lobby.game?.buyProperty();

    callback(null, lobby.game!.getClientGameData(user.socketId));
  }

  endTurn(socketId: string, callback: (error: SocketError | null, data: IClientGameData | null) => void) {
    callback = callback || (() => {});

    const result = this.getUserLobbyGame(socketId, callback);
    if (!result) {
      return;
    }
    const { lobby } = result;

    lobby.game?.endTurn();

    callback(null, lobby!.game!.getClientGameData(socketId));
  }

  buyBuilding(
    socketId: string,
    tilePosition: number,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ) {
    callback = callback || (() => {});

    const result = this.getUserLobbyGame(socketId, callback);
    if (!result) {
      return;
    }
    const { user, lobby } = result;

    if (tilePosition < 0 || tilePosition >= lobby!.game!.stateMachine.gameData.tiles.length) {
      callback({ code: 'invalid_tile_position', message: 'Invalid tile position' }, null);
      return;
    }

    lobby.game!.buyBuilding(tilePosition);

    callback(null, lobby.game!.getClientGameData(user.socketId));
  }

  // ** Helpers **
  getUserLobbyGame(
    socketId: string,
    callback: (error: SocketError | null, data: IClientGameData | null) => void
  ): { user: User; lobby: Lobby } | null {
    const user = this.users.find((u) => u.socketId === socketId);
    if (!user) {
      callback({ code: 'user_not_found', message: 'User not found' }, null);
      return null;
    }

    const lobby = this.lobbies.find((l) => l.users.find((u) => u.socketId === socketId));
    if (!lobby) {
      callback({ code: 'lobby_not_found', message: 'Lobby not found' }, null);
      return null;
    }

    if (!lobby.game) {
      callback({ code: 'game_not_found', message: 'Game not found' }, null);
      return null;
    }

    return { user, lobby };
  }

  emitLobbyData() {
    for (const user of this.users) {
      this.io?.to(user.socketId).emit('lobbyData', this.getClientLobbyData());
    }
  }

  getClientLobbyData(): IClientLobbyData[] {
    return this.lobbies.map((l) => l.clientLobbyData);
  }
}
