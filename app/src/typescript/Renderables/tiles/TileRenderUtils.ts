import * as PIXI from 'pixi.js';

export class TileRenderUtils {
  static fade(container: PIXI.Container) {
    container.filters = [new PIXI.filters.AlphaFilter(0.5), new PIXI.filters.BlurFilter(5)];
  }

  static unfade(container: PIXI.Container) {
    container.filters = [];
  }

  static darken(container: PIXI.Container) {
    const darkenFilter = new PIXI.filters.ColorMatrixFilter();
    darkenFilter.brightness(0.5, false);
    container.filters = [darkenFilter];
  }

  static undarken(container: PIXI.Container) {
    if (container.filters) {
      container.filters = container.filters.filter((f) => !(f instanceof PIXI.filters.ColorMatrixFilter));
    }
  }
}
