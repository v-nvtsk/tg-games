import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
  background!: GameObjects.Image;
  logo!: GameObjects.Image;
  title!: GameObjects.Text;
  startButton!: GameObjects.Text;
  logoTween: Phaser.Tweens.Tween | null;

  constructor() {
    super("MainMenu");
  }

  create(): void {
    // Фон
    this.background = this.add.image(512, 384, "background");

    // Логотип
    this.logo = this.add.image(512, 300, "logo").setDepth(100);

    // Заголовок
    this.title = this.add.text(512, 460, "Main Menu", {
      fontFamily: "Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    }).setOrigin(0.5)
      .setDepth(100);

    // Кнопка Start Game
    this.startButton = this.add.text(512, 550, "Start Game", {
      fontFamily: "Arial Black",
      fontSize: 48,
      color: "#ffffff",
      backgroundColor: "#333333",
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    })
      .setOrigin(0.5)
      .setDepth(100)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("PlayerScene"); // или "MainGame", в зависимости от того, какую сцену ты хочешь запустить
      })
      .on("pointerover", () => {
        this.startButton.setStyle({ fill: "#ffff00" }); // при наведении
      })
      .on("pointerout", () => {
        this.startButton.setStyle({ fill: "#ffffff" }); // при уходе курсора
      });

    // Эмит события для App
    EventBus.emit("current-scene-ready", this);
  }

  changeScene(): void {
    if (this.logoTween) {
      this.logoTween.stop();
      this.logoTween = null;
    }
    this.scene.start("Game");
  }

  moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void): void {
    if (this.logoTween) {
      if (this.logoTween.isPlaying()) {
        return;
      }
    }

    this.logoTween = this.tweens.add({
      targets: this.logo,
      y: this.logo.y + 20,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.logo.on("animationrepeat", () => {
      vueCallback({ x: this.logo.x, y: this.logo.y });
    });
  }
}
