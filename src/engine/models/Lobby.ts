import crypto from 'crypto';
import { User } from './User';

export class Lobby {
  id: string;
  users: User[] = [];
  owner: User | null = null;

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
}
