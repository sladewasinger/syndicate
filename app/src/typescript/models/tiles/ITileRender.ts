import type * as PIXI from 'pixi.js';

export interface ITileRender {
  width: number;
  height: number;
  drawInitial(args: ITileRenderArgs, container: PIXI.Container): void;
}

export interface ITileRenderArgs {
  x: number;
  y: number;
  rotation: number;
}
