import * as PIXI from 'pixi.js';

export class ButtonRender {
  container: PIXI.Container;
  buttonText: PIXI.Text;

  constructor(
    public parentContainer: PIXI.Container,
    public text: string,
    public color: number,
    public callback: () => void,
    public textColor: number = 0xffffff
  ) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);

    const button = new PIXI.Graphics();
    button.beginFill(this.color);
    button.lineStyle(2, 0x000000);
    button.drawRoundedRect(0, 0, 150, 100, 10);
    button.endFill();

    let fontSize = 34;
    if (this.text.split(' ').some((word) => word.length > 8)) {
      fontSize = 28;
    }
    const buttonText = new PIXI.Text(this.text, {
      fontFamily: 'Arial',
      fontSize: fontSize,
      wordWrap: true,
      wordWrapWidth: button.width,
      fill: this.textColor,
      align: 'center',
    });
    buttonText.x = button.width / 2 - buttonText.width / 2;
    buttonText.y = button.height / 2 - buttonText.height / 2;
    this.buttonText = buttonText;

    this.container.addChild(button, buttonText);
    this.container.buttonMode = true;
    this.container.interactive = true;
    this.container.on('pointerup', this.callback);
  }

  get x() {
    return this.container.x;
  }

  set x(value) {
    this.container.x = value;
  }

  get y() {
    return this.container.y;
  }

  set y(value) {
    this.container.y = value;
  }

  get width() {
    return this.container.width;
  }

  set width(value) {
    this.container.width = value;
  }

  get height() {
    return this.container.height;
  }

  set height(value) {
    this.container.height = value;
  }

  disable() {
    const darkenFilter = new PIXI.filters.ColorMatrixFilter();
    darkenFilter.matrix = [0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 1, 0];

    this.container.filters = [new PIXI.filters.BlurFilter(2), darkenFilter];
    this.container.interactive = false;
    this.container.buttonMode = false;
  }

  enable() {
    this.container.filters = [];
    this.container.interactive = true;
    this.container.buttonMode = true;
  }
}
