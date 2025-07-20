import Phaser from "phaser";
import { getAssetsPathByType, setBackground } from "$/utils";
import { gameFlowManager } from "$/processes";

export interface Slide {
  key: string;
  path: string;
  message: string;
}

const SLIDE_TIMEOUT = 1000;
const colors = {
  messageBackground: 0xffffff,
  messageText: 0x000000,
  nextButton: 0x000000,
  progressBar: 0x888888,
  progressBarFill: 0x4CAF50,
};

export class IntroPhaserScene extends Phaser.Scene {
  private slides: Slide[];
  private currentSlideIndex = 0;
  private background!: Phaser.GameObjects.Image;
  private thoughtBubbleContainer!: Phaser.GameObjects.Container;
  private nextButton!: Phaser.GameObjects.Image;
  private progressBarBackground!: Phaser.GameObjects.Graphics;
  private progressBarFill!: Phaser.GameObjects.Graphics;
  private tapAllowed = false;

  constructor() {
    super("Intro");
    this.slides = [
      { key: "slide1",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide1.png" }),
        message: "Добро пожаловать в мир приключений!" },
      { key: "slide2",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide2.png" }),
        message: "Исследуйте неизведанные земли и города." },
      { key: "slide3",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide3.png" }),
        message: "Встречайте новых друзей." },
      { key: "slide4",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide4.png" }),
        message: "Развивайте свои навыки и становитесь сильнее." },
      { key: "slide5",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide5.png" }),
        message: "Ваше путешествие начинается прямо сейчас!" },
    ];
  }

  preload() {
    this.slides.forEach((slide) => {
      this.load.image(slide.key, slide.path);
    });

    this.load.svg("nextButtonIcon", getAssetsPathByType({ type: "images",
      filename: "icons/next-arrow.svg" }), { width: 64,
      height: 64 });
  }

  create() {
    this.showSlide(this.currentSlideIndex);
    this.input.on("pointerdown", this.handleTap.bind(this));
  }

  private showSlide(index: number) {
    this.tapAllowed = false;

    if (index >= this.slides.length) {
      this.scene.stop();
      gameFlowManager.startGameMap();
      if (this.nextButton) {
        this.tweens.killTweensOf(this.nextButton);
        this.nextButton.destroy();
      }
      if (this.progressBarBackground) {
        this.progressBarBackground.destroy();
      }
      if (this.progressBarFill) {
        this.tweens.killTweensOf(this.progressBarFill);
        this.progressBarFill.destroy();
      }
      if (this.thoughtBubbleContainer) {
        this.thoughtBubbleContainer.destroy();
      }
      return;
    }

    if (this.background) {
      this.background.destroy();
    }
    if (this.thoughtBubbleContainer) {
      this.thoughtBubbleContainer.destroy();
    }
    if (this.nextButton) {
      this.tweens.killTweensOf(this.nextButton);
      this.nextButton.destroy();
    }
    if (this.progressBarBackground) {
      this.progressBarBackground.destroy();
    }
    if (this.progressBarFill) {
      this.tweens.killTweensOf(this.progressBarFill);
      this.progressBarFill.destroy();
    }

    const { key, message } = this.slides[index];

    this.background = setBackground(this, key, true);

    this.background.setOrigin(0.5, 0.5);
    this.background.setPosition(this.scale.width / 2, this.scale.height / 2);

    this.thoughtBubbleContainer = this.createThoughtBubble(message);
    this.thoughtBubbleContainer.setAlpha(0);
    this.thoughtBubbleContainer.setPosition(this.scale.width / 2, this.scale.height * 0.75);

    this.nextButton = this.add.image(
      this.scale.width - 80,
      this.scale.height - 80,
      "nextButtonIcon",
    )
      .setOrigin(0.5)
      .setScale(1)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    this.nextButton.on("pointerdown", () => {
      this.handleTap();
    });

    const progressBarWidth = this.scale.width * 0.6;
    const progressBarHeight = 10;
    const progressBarX = (this.scale.width - progressBarWidth) / 2;
    const progressBarY = this.scale.height - 30;
    const progressBarRadius = progressBarHeight / 2;

    this.progressBarBackground = this.add.graphics({ fillStyle: { color: colors.progressBar,
      alpha: 0.5 } });
    this.progressBarBackground.fillRoundedRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight, progressBarRadius);

    this.progressBarFill = this.add.graphics({ fillStyle: { color: colors.progressBarFill,
      alpha: 1 } });

    this.background.alpha = 0;
    this.tweens.add({
      targets: this.background,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.tweens.add({
          targets: this.thoughtBubbleContainer,
          alpha: 1,
          y: this.scale.height * 0.70,
          duration: 700,
          ease: "Power2",
          onComplete: () => {
            this.tweens.add({
              targets: { currentWidth: 0 },
              currentWidth: progressBarWidth,
              duration: SLIDE_TIMEOUT,
              ease: "Linear",
              onUpdate: (tween) => {
                this.progressBarFill.clear();
                const currentAnimatedWidth = tween.getValue() || 0;

                if (currentAnimatedWidth > 0) {
                  if (currentAnimatedWidth < progressBarRadius * 2) {
                    this.progressBarFill.fillCircle(progressBarX + currentAnimatedWidth / 2, progressBarY + progressBarRadius, currentAnimatedWidth / 2);
                  } else {
                    this.progressBarFill.fillRoundedRect(progressBarX, progressBarY, currentAnimatedWidth, progressBarHeight, progressBarRadius);
                  }
                }
              },
              onComplete: () => {
                this.tapAllowed = true;
                this.tweens.add({
                  targets: this.nextButton,
                  alpha: 1,
                  scale: 1.2,
                  duration: 300,
                  yoyo: true,
                  repeat: 0,
                  ease: "Power1",
                  onComplete: () => {
                    this.tweens.add({
                      targets: this.nextButton,
                      alpha: { from: 1,
                        to: 0.5 },
                      duration: 500,
                      yoyo: true,
                      repeat: -1,
                      ease: "Sine.easeInOut",
                    });
                  },
                });
              },
            });
          },
        });
      },
    });
  }

  private createThoughtBubble(message: string): Phaser.GameObjects.Container {
    const bubblePadding = 20;
    const pointerWidth = 20;
    const pointerHeight = 15;
    const borderRadius = 15;

    const text = this.add.text(0, 0, message, {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#000000",
      align: "center",
      wordWrap: { width: this.scale.width * 0.7,
        useAdvancedWrap: true },
    }).setOrigin(0.5);

    const textWidth = text.width;
    const textHeight = text.height;

    const bubbleWidth = textWidth + bubblePadding * 2;
    const bubbleHeight = textHeight + bubblePadding * 2;

    const graphics = this.add.graphics();
    graphics.fillStyle(colors.messageBackground, 0.9);
    graphics.lineStyle(2, colors.messageText, 1);

    graphics.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, borderRadius);
    graphics.strokeRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, borderRadius);

    graphics.beginPath();
    graphics.moveTo(0, bubbleHeight / 2 - borderRadius / 2);
    graphics.lineTo(-pointerWidth / 2, bubbleHeight / 2 + pointerHeight);
    graphics.lineTo(pointerWidth / 2, bubbleHeight / 2 + pointerHeight);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    const container = this.add.container(0, 0, [graphics, text]);
    container.setDepth(10);

    return container;
  }

  private handleTap(): void {
    if (this.tapAllowed) {
      this.tapAllowed = false;

      this.tweens.killTweensOf(this.nextButton);
      this.tweens.killTweensOf(this.progressBarFill);

      this.tweens.add({
        targets: [this.background, this.thoughtBubbleContainer, this.nextButton, this.progressBarBackground, this.progressBarFill],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.background.destroy();
          this.thoughtBubbleContainer.destroy();
          this.nextButton.destroy();
          this.progressBarBackground.destroy();
          this.progressBarFill.destroy();
          this.currentSlideIndex++;
          this.showSlide(this.currentSlideIndex);
        },
      });
    }
  }
}
