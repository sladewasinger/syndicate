import * as PIXI from 'pixi.js';
import type { ITileRender } from '../Renderables/tiles/ITileRender';
import { GlowFilter } from 'pixi-filters';

export class RenderHelpers {
  static highlight(tile: ITileRender) {
    const filter = new GlowFilter({
      distance: 25,
      outerStrength: 1,
      innerStrength: 1,
      color: 0xffffff,
    });
    tile.container.filters = [filter];
  }

  static unhighlight(tile: ITileRender) {
    tile.container.filters = (tile.container.filters || []).filter((f) => !(f instanceof GlowFilter));
  }
}
