import { SocketError } from './SocketError';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  registerName: (name: string, callback: (error: SocketError, data: string) => void) => void;
}
