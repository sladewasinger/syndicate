import { IClientUser } from './shared/IClientUser';

export class User {
  name: string | null = null;
  constructor(public socketId: string) {}

  get clientUser() {
    const clientUser: IClientUser = {
      name: this.name,
      id: this.socketId,
    };
    return clientUser;
  }
}
