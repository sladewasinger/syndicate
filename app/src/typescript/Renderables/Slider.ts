import * as PIXI from 'pixi.js';

export class Slider {
  container: PIXI.Container;
  value: number;
  width: number;
  dragging: boolean = false;
  label: PIXI.Text;
  moneyValue: PIXI.Text;

  constructor(
    public parentContainer: PIXI.Container,
    public labelText: string,
    public min: number,
    public max: number,
    public step: number
  ) {
    this.container = new PIXI.Container();
    this.value = Math.max(0, min);

    this.width = this.parentContainer.width * 0.8;

    const label = new PIXI.Text(labelText, {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'center',
    });
    this.container.addChild(label);
    this.label = label;

    const background = new PIXI.Graphics();
    background.lineStyle(2, 0x000000, 1);
    background.beginFill(0xffffff);
    background.drawRect(0, 0, this.width, 20);
    background.endFill();
    background.y = label.height + 5;
    this.container.addChild(background);

    const slider = new PIXI.Graphics();
    slider.lineStyle(2, 0x000000, 1);
    slider.beginFill(0x000000);
    slider.drawRect(0, 0, 10, 20);
    slider.endFill();
    slider.y = label.height + 5;
    this.container.addChild(slider);

    const moneyValue = new PIXI.Text('$0', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'center',
    });
    moneyValue.x = background.width / 2 - moneyValue.width;
    moneyValue.y = 0;
    this.container.addChild(moneyValue);
    this.moneyValue = moneyValue;

    this.container.interactive = true;
    this.container.buttonMode = true;
    this.setMax(max);

    parentContainer.addChild(this.container);
  }

  setMax(max: number) {
    this.max = max;
    if (this.value > max) {
      this.setValue(max);
      this.setSliderPosition(this.value);
    }

    this.container.removeListener('pointerdown');
    this.container.on('pointerdown', (event: PIXI.InteractionEvent) => {
      this.dragging = true;
      this.setSliderPosition(event.data.getLocalPosition(this.container).x);
    });
    this.container.removeListener('pointerup');
    this.container.on('pointerup', (event: PIXI.InteractionEvent) => {
      this.dragging = false;
    });
    this.container.on('mousemove', (event: PIXI.InteractionEvent) => {
      if (this.dragging) {
        this.setSliderPosition(event.data.getLocalPosition(this.container).x);
      }
    });
    this.container.on('pointerupoutside', (event: PIXI.InteractionEvent) => {
      this.dragging = false;
    });
  }

  private setSliderPosition(x: number) {
    let value = Math.round((x / this.width) * (this.max - this.min) + this.min);
    value = Math.round(value / this.step) * this.step;
    value = Math.min(this.max, Math.max(this.min, value));
    this.setValue(value);
  }

  setValue(value: number) {
    this.value = value;
    this.moneyValue.text = `$${this.value}`;
    const slider = this.container.children[2] as PIXI.Graphics;
    slider.x = ((value - this.min) / (this.max - this.min)) * this.width;
  }

  getValue() {
    return this.value;
  }

  disable() {
    this.container.interactive = false;
    this.container.buttonMode = false;
    this.container.alpha = 0.5;
  }

  enable() {
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.alpha = 1;
  }
}
