import * as PIXI from 'pixi.js';

export class Checkbox {
  container: PIXI.Container;
  checkbox = new PIXI.Graphics();
  checked: boolean = false;
  text: PIXI.Text;

  constructor(
    public id: string,
    public parentContainer: PIXI.Container,
    public label: string,
    public clickCallback: (checkbox: Checkbox) => void,
    public color: number = 0x000000
  ) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);

    const checkbox = new PIXI.Graphics();
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.on('pointerdown', () => {
      this.checked = !this.checked;
      this.setChecked(this.checked);
      this.clickCallback(this);
    });
    this.container.addChild(checkbox);

    const text = new PIXI.Text(this.label, {
      fontFamily: 'Arial',
      fontSize: 38,
      stroke: 0x000000,
      strokeThickness: 4,
      letterSpacing: 2,
      fill: this.color,
      align: 'center',
    });
    text.x = 30;
    text.y = checkbox.height / 2 - text.height / 2;
    this.container.addChild(text);

    this.checkbox = checkbox;
    this.text = text;

    this.setChecked(false);
  }

  setChecked(checked: boolean) {
    this.checked = checked;
    if (this.checked) {
      this.checkbox.lineStyle(2, 0x000000, 1);
      this.checkbox.beginFill(0x000000);
      this.checkbox.drawCircle(7.5, 0, 15);
      this.checkbox.endFill();
    } else {
      this.checkbox.lineStyle(2, 0x000000, 1);
      this.checkbox.beginFill(0xffffff);
      this.checkbox.drawCircle(7.5, 0, 15);
      this.checkbox.endFill();
    }
  }
}
