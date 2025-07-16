import Phaser from "phaser";
import { getAssetsPath } from "@/utils/get-assets-path"; // Убедитесь, что этот импорт есть

export default class IntroPhaserScene extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  preload(): void {
    // Убедитесь, что эта строка раскомментирована
    this.load.image("intro-background", getAssetsPath("images/bg.png"));
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Убедитесь, что эта строка раскомментирована
    const background = this.add.image(width / 2, height / 2, "intro-background");
    background.setOrigin(0.5);
    background.displayWidth = this.sys.game.config.width as number;
    background.displayHeight = this.sys.game.config.height as number;
  }

  update() {
    // Ваша логика обновления, если есть
  }
}
