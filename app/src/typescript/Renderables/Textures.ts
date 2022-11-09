import { Assets } from '@pixi/assets';

export class Textures {
  static arrowTexture: any;

  static async loadTextures() {
    this.arrowTexture = await Assets.load('arrow.png');
  }
}
