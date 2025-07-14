import { createTiledBackground } from "../../../utils/create-tiled-background";
import { getAssetsPath } from "../../../utils/get-assets-path";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class PlayerScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveLeft = false;
  private moveRight = false;
  private background!: Phaser.GameObjects.TileSprite;

  constructor() {
    super("PlayerScene");
  }

  preload(): void {
    // Загружаем спрайты
    this.load.spritesheet("player_walk", getAssetsPath("schoolboy.png"), {
      frameWidth: 100,
      frameHeight: 256,
      startFrame: 1,
      endFrame: 8,

    });
    this.load.spritesheet("player_idle", getAssetsPath("schoolboy.png"), {
      frameWidth: 95,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 0,
    });

    this.load.image("game/background", getAssetsPath("background.png"));
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    this.background = createTiledBackground(this, "game/background");

    // Вычисляем масштаб так, чтобы фон покрывал экран целиком
    const scaleY = height / this.background.height;

    this.background.setScale(scaleY);

    // Создаём игрока
    this.player = this.physics.add.sprite(width / 2, height * 3 / 4, "player_idle").setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // Анимации
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player_walk", { start: 0, end: 8 }),
      frameRate: 16,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1,
    });

    // Управление
    if (this.input.keyboard)
      this.cursors = this.input.keyboard.createCursorKeys();

    this.input.addPointer(1);

    // Камера следует за игроком
    this.cameras.main.startFollow(this.player, true, 0.5, 0, 0, 50);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.scale.on("resize", this.resizeGame, this);

    // Сообщаем, что сцена готова
    EventBus.emit("current-scene-ready", this);
  }

  resizeGame(gameSize: { width: number; height: number }) {
    const { width, height } = gameSize;

    if (this.background) {
      this.background.displayWidth = width;
      this.background.displayHeight = height;
      this.background.setOrigin(0, 0);
    }

    if (this.player) {
      this.player.setPosition(width / 2, height - 200);
    }
  }

  update(): void {
    if (this.moveLeft || this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      if (this.player.anims.currentAnim?.key !== "walk") {
        this.player.play("walk", true);
      }
      this.player.setFlipX(true);
    } else if (this.moveRight || this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      if (this.player.anims.currentAnim?.key !== "walk") {
        this.player.play("walk", true);
      }
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
      if (this.player.anims.currentAnim?.key !== "idle") {
        this.player.play("idle", true);
      }
    }

    if (this.input.pointer1.isDown) {
      const { width } = this.sys.game.canvas;

      if (this.input.pointer1.x < width / 2) {
        this.moveLeft = true;
        this.moveRight = false;
      } else if (this.input.pointer1.x > width / 2){
        this.moveLeft = false;
        this.moveRight = true;
      }
    }

    if (!this.input.pointer1.isDown) {
      this.moveLeft = false;
      this.moveRight = false;
    }

    // Обновляем фон
    if (this.player.body && this.player.body.velocity.x !== 0) {
      const speedFactor = 0.5; // можно регулировать скорость фона
      this.background.tilePositionX += this.player.body.velocity.x * speedFactor * this.game.loop.delta / 1000;
    }
  }

}
