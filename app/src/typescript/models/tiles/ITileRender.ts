import type * as PIXI from 'pixi.js';

export interface ITileRender {
  width: number;
  height: number;
  drawInitial(x: number, y: number, rotation: number, container: PIXI.Container): void;
}
