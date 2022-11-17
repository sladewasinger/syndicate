import type { ITileRender } from './tiles/ITileRender';
import type { PlayersRender } from './PlayersRender';

export class RenderData {
  frame: number = 0;
  myPlayerId: string = '';
  renderTiles: ITileRender[] = [];
  playersRender: PlayersRender | undefined = undefined;
  diceState: 'idle' | 'rolling' | 'rolled' = 'idle';
  renderMode:
    | 'game'
    | 'mortgage'
    | 'unmortgage'
    | 'buyBuilding'
    | 'sellBuilding'
    | 'createTrade'
    | 'viewTrade'
    | 'auctionBid' = 'game';
  tradeTargetPlayerId: string = '';
}
