// === ./src/features/move-phaser-scene/move-phaser-scene.ts ===
import { createTiledBackground } from "@/utils/create-tiled-background";
import { getAssetsPath } from "@/utils/get-assets-path";
import { Scene } from "phaser";
import { gameFlowManager } from "@/processes/game-flow/game-flow-manager";
import type { MoveSceneData } from "@/processes/game-flow/game-flow-manager";

const GROUND_HEIGHT = 50; // Consistent GROUND_HEIGHT

export class MovePhaserScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveLeft = false;
  private moveRight = false;
  private background!: Phaser.GameObjects.TileSprite;
  private targetX: number | null = null;
  private targetY: number | null = null;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("MoveScene");
  }

  init(data: MoveSceneData): void {
    this.targetX = data.targetX;
    this.targetY = data.targetY;
    console.log(`MoveScene initialized with target: X=${this.targetX}, Y=${this.targetY}`);
  }

  preload(): void {
    this.load.spritesheet("player_main_sprite", getAssetsPath("images/schoolboy.png"), {
      frameWidth: 103,
      frameHeight: 256,
    });
    this.load.image("move/background", getAssetsPath("images/background.png"));
    this.load.image("ground", getAssetsPath("images/platform.png"));
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    // Фон
    this.background = createTiledBackground(this, "move/background");
    const scaleY = height / this.background.height;
    this.background.setScale(scaleY);

    // Платформа
    this.platforms = this.physics.add.staticGroup();
    const platform = this.platforms.create(width, height, "ground") as Phaser.Physics.Arcade.Sprite;
    platform.setOrigin(0.5, 0.5);
    platform.displayWidth = width * 2;
    platform.displayHeight = GROUND_HEIGHT * 1.5;
    platform.refreshBody();

    // Игрок
    this.player = this.physics.add.sprite(
      this.targetX || width / 2,
      height - GROUND_HEIGHT,
      "player_main_sprite",
    );
    this.player
      .setOrigin(0.5, 1)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setGravityY(500);
    this.player.body?.setSize(50, 150);
    // this.player.body?.setOffset(25, 50);

    // Анимации
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player_main_sprite", { start: 1, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_main_sprite", { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1,
    });

    // Управление
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    this.input.addPointer(1);

    // Камера
    this.cameras.main.setOrigin(0.5, 1);
    this.cameras.main.startFollow(this.player, true, 0.5, 1, 0, height / 2); // Смещаем центр камеры вниз
    this.cameras.main.setDeadzone(width * 0.1, 0);

    // Коллизия
    this.physics.add.collider(this.player, this.platforms);

    // Подписка на ресайз
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.scale.on("resize", this.resizeGame, this);

    // Кнопка возврата
    const backButton = this.add.text(width / 2, 50, "Вернуться на карту", {
      fontSize: "24px",
      color: "#fff",
      backgroundColor: "#880000",
      padding: { x: 10, y: 5 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    backButton.setScrollFactor(0);
    backButton.on("pointerdown", () => {
      gameFlowManager.startGameMap();
    });
  }

  resizeGame(gameSize: { width: number; height: number }) {
    const { width, height } = gameSize;
    console.log("gamesize width, height: ", width, height);

    if (this.background) {
      this.background.displayWidth = width;
      this.background.displayHeight = height;
    }

    // Если хочешь вручную обновлять платформу (не обязательно, Phaser делает это сам):
    if (this.platforms && this.platforms.getChildren().length > 0) {
      const platform = this.platforms.getChildren()[0] as Phaser.Physics.Arcade.Sprite;
      platform.setX(width / 2); // Center horizontally
      platform.setY(height); // Position at the very bottom
      platform.setOrigin(0.5, 1); // Center horizontally, bottom edge at Y
      platform.displayWidth = width; // Ensure it stretches across the width
      platform.displayHeight = GROUND_HEIGHT; // Keep consistent height
      platform.refreshBody();
    }

    // Adjust player position on resize
    if (this.player) {
      this.player.setX(this.targetX || width / 2); // Keep horizontal position or center
      this.player.setY(height - GROUND_HEIGHT); // Maintain distance from platform
    }

    // this.physics.world.setBounds(0, 0, width * 2.2, height * 1.1);
    // this.cameras.main.setDeadzone(width * 0.1, height * 0.1);

    this.cameras.main.setDeadzone(0, 0);
  }

  update(): void {
    if (!this.player || !this.player.body) return;

    const onGround = this.player.body.touching.down;
    if (onGround){
      this.player.setVelocityY(0);
    }

    if (this.cursors) {
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
    }

    if (this.input.pointer1.isDown) {
      const { width } = this.sys.game.canvas;
      if (this.input.pointer1.x < width / 2) {
        this.moveLeft = true;
        this.moveRight = false;
      } else if (this.input.pointer1.x > width / 2) {
        this.moveLeft = false;
        this.moveRight = true;
      }
    }

    if (!this.input.pointer1.isDown) {
      this.moveLeft = false;
      this.moveRight = false;
    }

    if (this.player.body.velocity.x !== 0) {
      const speedFactor = 0.5;
      // Commented out: this.groundVisual is not initialized as a TileSprite
      // this.groundVisual.tilePositionX += this.player.body.velocity.x * speedFactor * this.game.loop.delta / 1000;
      this.background.tilePositionX += this.player.body.velocity.x * speedFactor * this.game.loop.delta / 1000;
    }
  }
}
