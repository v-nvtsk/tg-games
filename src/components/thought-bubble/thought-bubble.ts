import Phaser from "phaser";

interface ThoughtOption {
  text: string;
  value: string;
}

interface OptionButtonElements {
  bg: Phaser.GameObjects.Graphics;
  textDisplay: Phaser.GameObjects.Text;
  value: string;
}

export class ThoughtBubble extends Phaser.GameObjects.Container {

  private questionText: string;
  private options: ThoughtOption[];

  private puffs: Phaser.GameObjects.Ellipse[] = [];
  private mainBubble: Phaser.GameObjects.Graphics | null = null;
  private questionDisplay: Phaser.GameObjects.Text | null = null;
  private optionButtons: OptionButtonElements[] = [];

  public onOptionSelected: Phaser.Events.EventEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number, questionText: string, options: ThoughtOption[] = []) {
    super(scene, x, y);

    this.questionText = questionText;
    this.options = options;

    this.onOptionSelected = new Phaser.Events.EventEmitter();

    this.createPuffs();
    this.createMainBubble();
    this.createQuestionText();
    this.createOptionButtons();

    this.puffs.forEach((puff) => this.add(puff));

    if (this.mainBubble) this.add(this.mainBubble);
    if (this.questionDisplay) this.add(this.questionDisplay);
    this.optionButtons.forEach((btn) => {
      this.add(btn.bg);
      this.add(btn.textDisplay);
    });

    this.mainBubble?.setVisible(false);
    this.questionDisplay?.setVisible(false);
    this.puffs.forEach((puff) => puff.setVisible(false));
    this.optionButtons.forEach((btn) => {
      btn.bg.setVisible(false);
      btn.textDisplay.setVisible(false);
    });

    this.scene.add.existing(this);
    this.setDepth(10);
  }

  private createPuffs(): void {
    const puffColors = [0xffffff, 0xcccccc, 0x999999];
    const puffConfigs = [
      { x: 0,
        y: -40,
        width: 10,
        height: 8,
        color: puffColors[0] },
      { x: -10,
        y: -75,
        width: 16,
        height: 12,
        color: puffColors[1] },
      { x: 10,
        y: -110,
        width: 22,
        height: 16,
        color: puffColors[2] },
    ];

    puffConfigs.forEach((config) => {
      const puff = this.scene.add.ellipse(config.x, config.y, config.width, config.height, config.color);
      puff.setOrigin(0.5);
      this.puffs.push(puff);
    });
  }

  private createMainBubble(): void {
    this.mainBubble = this.scene.add.graphics();
    this.mainBubble.fillStyle(0xffffff, 1);

    let bubbleHeight = 70;
    if (this.options.length > 0) {
      bubbleHeight += this.options.length * 30 + 10;
    }

    this.mainBubble.fillRoundedRect(-120, -220, 240, bubbleHeight, 16);
    this.mainBubble.lineStyle(2, 0x000000, 1);
    this.mainBubble.strokeRoundedRect(-120, -220, 240, bubbleHeight, 16);
  }

  private createQuestionText(): void {
    this.questionDisplay = this.scene.add.text(0, -195, this.questionText, {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#000000",
      align: "center",
      wordWrap: { width: 220 },
    }).setOrigin(0.5);
  }

  private createOptionButtons(): void {
    const startY = -160;
    const buttonHeight = 25;
    const buttonPadding = 5;

    this.options.forEach((option, index) => {
      const buttonY = startY + index * (buttonHeight + buttonPadding);

      const buttonBg = this.scene.add.graphics();
      buttonBg.fillStyle(0xdddddd, 1);
      buttonBg.fillRoundedRect(-100, buttonY, 200, buttonHeight, 8);
      buttonBg.lineStyle(1, 0x666666, 1);
      buttonBg.strokeRoundedRect(-100, buttonY, 200, buttonHeight, 8);
      buttonBg.setInteractive(new Phaser.Geom.Rectangle(-100, buttonY, 200, buttonHeight), (hitArea: Phaser.Geom.Rectangle, x, y) => {
        return Phaser.Geom.Rectangle.Contains(hitArea, x, y);
      });

      const buttonText = this.scene.add.text(0, buttonY + buttonHeight / 2, option.text, {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#000000",
        align: "center",
        wordWrap: { width: 190 },
      }).setOrigin(0.5);

      buttonBg.on("pointerdown", () => {
        this.onOptionSelected.emit("selected", option.value);
        this.hide();
      });

      buttonBg.on("pointerover", () => buttonBg.fillStyle(0xeeeeee, 1).fillRoundedRect(-100, buttonY, 200, buttonHeight, 8));
      buttonBg.on("pointerout", () => buttonBg.fillStyle(0xdddddd, 1).fillRoundedRect(-100, buttonY, 200, buttonHeight, 8));

      this.optionButtons.push({
        bg: buttonBg,
        textDisplay: buttonText,
        value: option.value,
      });
    });
  }

  public show(onComplete?: () => void): void {
    this.scene.tweens.chain({
      tweens: [
        {
          targets: this.puffs[0],
          y: this.puffs[0].y - 5,
          alpha: { from: 0,
            to: 1 },
          scaleX: { from: 0,
            to: 1 },
          scaleY: { from: 0,
            to: 1 },
          visible: true,
          ease: "Power1",
          duration: 150,
        },
        {
          targets: this.puffs[1],
          y: this.puffs[1].y - 5,
          alpha: { from: 0,
            to: 1 },
          scaleX: { from: 0,
            to: 1 },
          scaleY: { from: 0,
            to: 1 },
          delay: 75,
          visible: true,
          ease: "Power1",
          duration: 150,
        },
        {
          targets: this.puffs[2],
          y: this.puffs[2].y - 5,
          alpha: { from: 0,
            to: 1 },
          scaleX: { from: 0,
            to: 1 },
          scaleY: { from: 0,
            to: 1 },
          delay: 150,
          visible: true,
          ease: "Power1",
          duration: 150,
          onComplete: () => {
            const targetsToAnimate: (Phaser.GameObjects.Graphics | Phaser.GameObjects.Text)[] = [];
            if (this.mainBubble) {
              this.mainBubble.setVisible(true);
              targetsToAnimate.push(this.mainBubble);
            }
            if (this.questionDisplay) {
              this.questionDisplay.setVisible(true);
              targetsToAnimate.push(this.questionDisplay);
            }
            this.optionButtons.forEach((btn) => {
              btn.bg.setVisible(true);
              btn.textDisplay.setVisible(true);
              targetsToAnimate.push(btn.bg, btn.textDisplay);
            });

            this.scene.tweens.add({
              targets: targetsToAnimate,
              alpha: { from: 0,
                to: 1 },
              scale: { from: 0.8,
                to: 1 },
              ease: "Back.easeOut",
              duration: 300,
              onComplete: onComplete,
            });
          },
        },
      ],
    });
  }

  public hide(onComplete?: () => void): void {
    const targetsToAnimate: (Phaser.GameObjects.Graphics | Phaser.GameObjects.Text | Phaser.GameObjects.Ellipse)[] = [];
    if (this.mainBubble) targetsToAnimate.push(this.mainBubble);
    if (this.questionDisplay) targetsToAnimate.push(this.questionDisplay);
    this.optionButtons.forEach((btn) => targetsToAnimate.push(btn.bg, btn.textDisplay));
    this.puffs.forEach((puff) => targetsToAnimate.push(puff));

    this.scene.tweens.add({
      targets: targetsToAnimate,
      alpha: 0,
      scale: 0.8,
      ease: "Power1",
      duration: 200,
      onComplete: () => {
        this.mainBubble?.setVisible(false);
        this.questionDisplay?.setVisible(false);
        this.optionButtons.forEach((btn) => {
          btn.bg.setVisible(false);
          btn.textDisplay.setVisible(false);
        });
        this.puffs.forEach((puff) => puff.setVisible(false));
        if (onComplete) onComplete();
      },
    });
  }

  public updateContent(questionText: string, options: ThoughtOption[]): void {
    this.questionText = questionText;
    this.options = options;

    this.questionDisplay?.destroy();
    this.optionButtons.forEach((btn) => {
      btn.bg.destroy();
      btn.textDisplay.destroy();
    });
    this.optionButtons = [];

    this.mainBubble?.destroy();
    this.createMainBubble();
    if (this.mainBubble) this.addAt(this.mainBubble, 0);

    this.createQuestionText();
    this.createOptionButtons();

    if (this.questionDisplay) this.add(this.questionDisplay);
    this.optionButtons.forEach((btn) => {
      this.add(btn.bg);
      this.add(btn.textDisplay);
    });

    this.mainBubble?.setVisible(false);
    this.questionDisplay?.setVisible(false);
    this.optionButtons.forEach((btn) => {
      btn.bg.setVisible(false);
      btn.textDisplay.setVisible(false);
    });
    this.puffs.forEach((puff) => puff.setVisible(false));
  }
}
