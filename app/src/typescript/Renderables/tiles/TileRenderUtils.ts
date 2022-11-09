import * as PIXI from 'pixi.js';

export class TileRenderUtils {
  static fade(container: PIXI.Container) {
    container.filters = [new PIXI.filters.AlphaFilter(0.5), new PIXI.filters.BlurFilter(5)];
  }

  static unfade(container: PIXI.Container) {
    container.filters = [];
  }
}
