export type ErrorCode =
  | 'user_not_found'
  | 'lobby_not_found'
  | 'lobby_full'
  | 'player_not_found'
  | 'game_not_found'
  | 'generic_error'
  | 'missing_key';

export class SocketError {
  constructor(public code: ErrorCode, public message: string) {}
}
