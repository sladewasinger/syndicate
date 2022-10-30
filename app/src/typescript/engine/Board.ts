import * as PIXI from 'pixi.js';

export class Board {
  canvas: HTMLCanvasElement;
  app: PIXI.Application;
  width: number;
  height: number;
  container: PIXI.Container;
  resizeTimer: NodeJS.Timeout = <any>{};

  constructor() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      throw new Error('No canvas found');
    }
    this.canvas = canvas as HTMLCanvasElement;
    this.width = 927;
    this.height = 927;
    this.app = new PIXI.Application({
      view: this.canvas,
      width: 927,
      height: 927,
      backgroundColor: 0x222222,
      resolution: window.devicePixelRatio || 1,
    });
    this.container = this.app.stage;
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(this.resize.bind(this), 250);
    });
  }

  resize() {
    const scale = Math.min(window.innerWidth / this.width, window.innerHeight / this.height);
    this.canvas.width = Math.min(this.width, this.width * scale);
    this.canvas.height = Math.min(this.height, this.height * scale);
    this.container.scale.set(scale);
  }

  drawBoardInitial() {
    const board = new PIXI.Graphics();
    board.lineStyle(1, 0x000000, 1);
    board.beginFill(0x000000, 1);
    board.drawRect(0, 0, this.width, this.height);
    board.endFill();
    this.container.addChild(board);

    const text = new PIXI.Text('Hello World', { fill: 0xffffff, fontSize: 24 });
    text.x = 100;
    text.y = 100;
    this.container.addChild(text);
  }
}
