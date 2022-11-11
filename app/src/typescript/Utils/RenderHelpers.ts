import * as PIXI from 'pixi.js';
import type { ITileRender } from '../Renderables/tiles/ITileRender';
import { GlowFilter, GodrayFilter } from 'pixi-filters';

export class RenderHelpers {
  static highlight(tile: ITileRender) {
    const filter = new GlowFilter({
      distance: 25,
      outerStrength: 1,
      innerStrength: 1,
      color: 0xffffff,
    });
    const filter2 = new GodrayFilter({
      lacunarity: 4,
    });
    tile.container.filters = [filter2];
  }

  static unhighlight(tile: ITileRender) {
    tile.container.filters = (tile.container.filters || []).filter(
      (f) => !(f instanceof GlowFilter) && !(f instanceof GodrayFilter)
    );
  }
}
