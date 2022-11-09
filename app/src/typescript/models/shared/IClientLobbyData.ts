import type { IClientUser } from './IClientUser';

export interface IClientLobbyData {
  id: string;
  users: IClientUser[];
  owner: IClientUser | undefined;
}
