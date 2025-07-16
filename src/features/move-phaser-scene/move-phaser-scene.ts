import { createTiledBackground } from "@/utils/create-tiled-background";
import { getAssetsPath } from "@/utils/get-assets-path";
import { Scene } from "phaser";
import { gameFlowManager } from "@/processes/game-flow/game-flow-manager";
import type { MoveSceneData } from "@/processes/game-flow/game-flow-manager";

export class MovePhaserScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveLeft = false;
  private moveRight = false;
  private background!: Phaser.GameObjects.TileSprite;
  private targetX: number | null = null;
  private targetY: number | null = null;
  private groundVisual!: Phaser.GameObjects.TileSprite; // Визуальная часть платформы
  private groundPhysics!: Phaser.Physics.Arcade.StaticGroup; // Физическая часть платформы

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

    const graphics = this.add.graphics();
    graphics.fillStyle(0x6B8E23, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("ground_texture_generated", 32, 32);
    graphics.destroy();
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    // Фон
    this.background = createTiledBackground(this, "move/background");
    const scaleY = height / this.background.height;
    this.background.setScale(scaleY);

    const groundHeight = 50;
    const groundY = height;

    // Визуальная платформа
    this.groundVisual = this.add.tileSprite(
      0,
      groundY,
      width,
      groundHeight,
      "ground_texture_generated",
    ).setOrigin(0, 1)
      .setScrollFactor(0);

    // Физическая платформа
    this.groundPhysics = this.physics.add.staticGroup();
    const groundPhysicsRect = this.add.rectangle(width / 2, groundY, width, groundHeight);
    this.groundPhysics.add(groundPhysicsRect);
    groundPhysicsRect.setVisible(false);

    // Игрок — немного выше платформы
    this.player = this.physics.add.sprite(
      this.targetX || width / 2,
      height - 150,
      "player_main_sprite",
    );

    this.player
      .setOrigin(0.2, 1) // центр по X, верх по Y
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setGravityY(500);

    this.player.body?.setSize(50, 150);
    this.player.body?.setOffset(25, -50);

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
    this.cameras.main.startFollow(this.player, true, 0.5, 0, 0, 50);
    this.cameras.main.setDeadzone(width * 0.1, height * 0.1);

    // Коллизия между игроком и платформой
    this.physics.add.collider(this.player, this.groundPhysics);

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
    const groundHeight = 50;

    if (this.background) {
      this.background.displayWidth = width;
      this.background.displayHeight = height;
      this.background.setOrigin(0, 0);
    }

    if (this.groundVisual) {
      this.groundVisual.setPosition(0, height - groundHeight);
      this.groundVisual.setSize(width, groundHeight);
    }

    if (this.groundPhysics && this.groundPhysics.getChildren().length > 0) {
      const groundPhysicsRect = this.groundPhysics.getChildren()[0] as Phaser.GameObjects.Rectangle;
      groundPhysicsRect.setPosition(width / 2, height - groundHeight / 2);
      groundPhysicsRect.setSize(width, groundHeight);
      this.groundPhysics.refresh();
    }

    if (this.player) {
      this.player.setPosition(this.player.x, height - groundHeight - 100);
    }

    this.physics.world.setBounds(0, 0, width * 2, height);
    this.cameras.main.setDeadzone(width * 0.1, height * 0.1);
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
      this.groundVisual.tilePositionX += this.player.body.velocity.x * speedFactor * this.game.loop.delta / 1000;
      this.background.tilePositionX += this.player.body.velocity.x * speedFactor * this.game.loop.delta / 1000;
    }
  }
}
