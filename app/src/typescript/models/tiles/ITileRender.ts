import type * as PIXI from 'pixi.js';

export interface ITileRender {
  width: number;
  height: number;
  container: PIXI.Container;
  drawInitial(args: ITileRenderArgs, container: PIXI.Container): void;
}

export interface ITileRenderArgs {
  x: number;
  y: number;
  rotation: number;
  textures: PIXI.utils.Dict<PIXI.LoaderResource>;
}
