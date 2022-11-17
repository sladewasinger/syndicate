import { Assets } from '@pixi/assets';

export class Textures {
  static arrowTexture: any;
  static mortgagedTexture: any;

  static async loadTextures() {
    this.arrowTexture = await Assets.load('arrow.png');
    this.mortgagedTexture = await Assets.load('mortgaged.png');
  }
}
