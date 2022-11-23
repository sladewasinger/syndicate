export type ErrorCode =
  | 'user_not_found'
  | 'lobby_not_found'
  | 'lobby_full'
  | 'player_not_found'
  | 'game_not_found'
  | 'generic_error'
  | 'missing_key'
  | 'invalid_tile_position'
  | 'trade_not_found'
  | 'invalid_trade_recipient'
  | 'not_your_turn';

export class SocketError {
  constructor(public code: ErrorCode, public message: string) {}
}
