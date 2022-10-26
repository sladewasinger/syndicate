export type ErrorCode = 'user_not_found' | 'lobby_not_found' | 'lobby_full';

export class SocketError {
  constructor(public code: ErrorCode, public message: string) {}
}
