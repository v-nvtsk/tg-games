import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { setBackground } from "../../../utils/set-background";

export class MainMenu extends Scene {
  background!: GameObjects.Image;
  logo!: GameObjects.Image;
  title!: GameObjects.Text;
  startButton!: GameObjects.Text;
  // logoTween: Phaser.Tweens.Tween | null;

  constructor() {
    super("MainMenu");
    // this.logoTween = null;
  }

  create(): void {
    const midX = this.cameras.main.width / 2;
    const midY = this.cameras.main.height / 2;
    let y = 0;

    const scale = this.cameras.main.width > this.cameras.main.height ? this.cameras.main.height / 768 : this.cameras.main.width / 1024;

    // Фон
    setBackground(this, "menu/background", true);

    // Логотип
    y += midY;
    this.logo = this.add.image(midX, y, "logo")
      .setDepth(100)
      .setScale(scale);

    // Заголовок
    y += 160 * scale;
    this.title = this.add.text(midX, y, "Главное меню", {
      fontFamily: "Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    }).setOrigin(0.5)
      .setDepth(100)
      .setScale(scale);

    // Кнопка Start Game
    y += 100 * scale;
    this.startButton = this.add.text(midX, y, "Начать игру", {
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
      })
      .setScale(scale);

    // Эмит события для App
    EventBus.emit("current-scene-ready", this);
  }

  changeScene(): void {
    this.scene.start("PlayerScene");
  }

  // moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void): void {
  //   if (this.logoTween) {
  //     if (this.logoTween.isPlaying()) {
  //       return;
  //     }
  //   }

  //   this.logoTween = this.tweens.add({
  //     targets: this.logo,
  //     y: this.logo.y + 20,
  //     duration: 500,
  //     yoyo: true,
  //     repeat: -1,
  //   });

  //   this.logo.on("animationrepeat", () => {
  //     vueCallback({ x: this.logo.x, y: this.logo.y });
  //   });
  // }
}
