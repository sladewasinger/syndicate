import type { ITileRender } from '../models/tiles/ITileRender';
import type { PlayersRender } from './PlayersRender';

export class RenderData {
  renderTiles: ITileRender[] = [];
  playersRender: PlayersRender | undefined = undefined;
}
