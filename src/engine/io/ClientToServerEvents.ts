import { SocketError } from './SocketError';

export interface ClientToServerEvents {
  registerName: (name: string, callback: (error: SocketError | null, data: string | null) => void) => void;
  createLobby: (callback: (error: SocketError | null, data: string | null) => void) => void;
  joinLobby: (key: string, callback: (error: SocketError | null, data: string | null) => void) => void;
}
