import Phaser from "phaser";
import { getAssetsPath } from "@utils/get-assets-path";

export default class AuthPhaserScene extends Phaser.Scene {
  constructor() {
    super("Auth");
  }

  preload(): void {

    this.load.image("intro-background", getAssetsPath("images/background.png"));
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    const background = this.add.image(width / 2, height / 2, "intro-background");
    background.setOrigin(0.5);
    background.displayWidth = this.sys.game.config.width as number;
    background.displayHeight = this.sys.game.config.height as number;
  }

  update() {
    /* */
  }
}
