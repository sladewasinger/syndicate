import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import type { IClientTile } from '@/typescript/models/shared/IClientTile';
import type * as PIXI from 'pixi.js';
import type { RenderData } from '../RenderData';

export interface ITileRender {
  width: number;
  height: number;
  container: PIXI.Container;
  tile: IClientTile;
  drawInitial(args: ITileRenderArgs, container: PIXI.Container): void;
  update(gameData: IClientGameData, renderData: RenderData): void;
  fade(): void;
  unfade(): void;
}

export interface ITileRenderArgs {
  x: number;
  y: number;
  rotation: number;
}
