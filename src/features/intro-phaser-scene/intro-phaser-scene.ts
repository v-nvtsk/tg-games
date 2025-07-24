import Phaser from "phaser";
import { getAssetsPathByType, setBackground } from "$/utils";
import { gameFlowManager } from "$/processes";

export interface Slide {
  key: string;
  path: string;
  message: string | null;
}

// TODO: исправить
const SLIDE_TIMEOUT = 100;

const colors = {
  messageBackground: 0xffffff,
  messageText: 0x000000,
  nextButton: 0x000000,
  progressBar: 0x888888,
  progressBarFill: 0x4CAF50,
};

const UI_CONSTANTS = {
  NEXT_BUTTON_OFFSET: 80,
  NEXT_BUTTON_APPEAR_SCALE: 1.2,
  NEXT_BUTTON_APPEAR_DURATION: 300,
  NEXT_BUTTON_BLINK_DURATION: 500,
  NEXT_BUTTON_BLINK_ALPHA_FROM: 1,
  NEXT_BUTTON_BLINK_ALPHA_TO: 0.5,

  PROGRESS_BAR_WIDTH_FACTOR: 0.6,
  PROGRESS_BAR_HEIGHT: 10,
  PROGRESS_BAR_Y_OFFSET: 30,

  BUBBLE_PADDING: 20,
  POINTER_WIDTH: 20,
  POINTER_HEIGHT: 15,
  BORDER_RADIUS: 15,
  MESSAGE_FONT_SIZE: "28px",
  MESSAGE_WORD_WRAP_FACTOR: 0.7,
  MESSAGE_INITIAL_Y_FACTOR: 0.75,
  MESSAGE_APPEAR_Y_FACTOR: 0.70,

  BACKGROUND_ALPHA_DURATION: 500,
  THOUGHT_BUBBLE_APPEAR_DURATION: 700,
  FADE_OUT_DURATION: 500,
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
      // { key: "slide1",
      //   path: getAssetsPathByType({ type: "images",
      //     scene: "intro",
      //     filename: "slide1.jpg" }),
      //   message: "Добро пожаловать в мир приключений!" },
      // { key: "slide2",
      //   path: getAssetsPathByType({ type: "images",
      //     scene: "intro",
      //     filename: "slide2.jpg" }),
      //   message: "Исследуйте неизведанные земли и города." },
      // { key: "slide3",
      //   path: getAssetsPathByType({ type: "images",
      //     scene: "intro",
      //     filename: "slide3.jpg" }),
      //   message: "Встречайте новых друзей." },
      // { key: "slide4",
      //   path: getAssetsPathByType({ type: "images",
      //     scene: "intro",
      //     filename: "slide4.jpg" }),
      //   message: "Развивайте свои навыки и становитесь сильнее." },
      // { key: "slide5",
      //   path: getAssetsPathByType({ type: "images",
      //     scene: "intro",
      //     filename: "slide5.jpg" }),
      //   message: "Ваше путешествие начинается прямо сейчас!" },
      ...Array.from({ length: 16 }, (_, i) => {
        const slideNumber = i + 1;
        const slideName = `slide-${slideNumber.toString().padStart(2, "0")}`;

        return {
          key: slideName,
          path: getAssetsPathByType({ type: "images",
            scene: "intro",
            filename: `${slideName}_small.jpg` }),
          message: null,
        };
      }),
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

    this.thoughtBubbleContainer.setAlpha(message === null ? 0 : 1);
    this.thoughtBubbleContainer.setPosition(this.scale.width / 2, this.scale.height * UI_CONSTANTS.MESSAGE_INITIAL_Y_FACTOR);

    this.nextButton = this.add.image(
      this.scale.width - UI_CONSTANTS.NEXT_BUTTON_OFFSET,
      this.scale.height - UI_CONSTANTS.NEXT_BUTTON_OFFSET,
      "nextButtonIcon",
    )
      .setOrigin(0.5)
      .setScale(1)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    this.nextButton.on("pointerdown", () => {
      this.handleTap();
    });

    const progressBarWidth = this.scale.width * UI_CONSTANTS.PROGRESS_BAR_WIDTH_FACTOR;
    const progressBarHeight = UI_CONSTANTS.PROGRESS_BAR_HEIGHT;
    const progressBarX = (this.scale.width - progressBarWidth) / 2;
    const progressBarY = this.scale.height - UI_CONSTANTS.PROGRESS_BAR_Y_OFFSET;
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
      duration: UI_CONSTANTS.BACKGROUND_ALPHA_DURATION,
      onComplete: () => {
        this.tweens.add({
          targets: this.thoughtBubbleContainer,
          alpha: message === null ? 0 : 1,
          y: this.scale.height * UI_CONSTANTS.MESSAGE_APPEAR_Y_FACTOR,
          duration: UI_CONSTANTS.THOUGHT_BUBBLE_APPEAR_DURATION,
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
                  scale: UI_CONSTANTS.NEXT_BUTTON_APPEAR_SCALE,
                  duration: UI_CONSTANTS.NEXT_BUTTON_APPEAR_DURATION,
                  yoyo: true,
                  repeat: 0,
                  ease: "Power1",
                  onComplete: () => {
                    this.tweens.add({
                      targets: this.nextButton,
                      alpha: { from: UI_CONSTANTS.NEXT_BUTTON_BLINK_ALPHA_FROM,
                        to: UI_CONSTANTS.NEXT_BUTTON_BLINK_ALPHA_TO },
                      duration: UI_CONSTANTS.NEXT_BUTTON_BLINK_DURATION,
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

  private createThoughtBubble(message: string | null): Phaser.GameObjects.Container {
    const bubblePadding = UI_CONSTANTS.BUBBLE_PADDING;
    const pointerWidth = UI_CONSTANTS.POINTER_WIDTH;
    const pointerHeight = UI_CONSTANTS.POINTER_HEIGHT;
    const borderRadius = UI_CONSTANTS.BORDER_RADIUS;

    const text = this.add.text(0, 0, message || "", {
      fontFamily: "Arial",
      fontSize: UI_CONSTANTS.MESSAGE_FONT_SIZE,
      color: colors.messageText.toString(),
      align: "center",
      wordWrap: { width: this.scale.width * UI_CONSTANTS.MESSAGE_WORD_WRAP_FACTOR,
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
        duration: UI_CONSTANTS.FADE_OUT_DURATION,
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
