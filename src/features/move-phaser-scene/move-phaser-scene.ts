import { Scene } from "phaser";
import { createTiledBackground, getAssetsPath } from "$/utils";
import type { MoveSceneData } from "@core/state";

const GROUND_HEIGHT = 50;

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
    this.load.spritesheet("player_main_sprite", getAssetsPath("images/hero.png"), {
      frameWidth: 174,
      frameHeight: 300,
    });
    this.load.image("move/background", getAssetsPath("images/background-variant.png"));
    this.load.image("ground", getAssetsPath("images/platform.png"));
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    this.background = createTiledBackground(this, "move/background");
    const scaleY = height / this.background.height;
    this.background.setScale(scaleY);

    this.platforms = this.physics.add.staticGroup();
    const platform = this.platforms.create(0, height, "ground") as Phaser.Physics.Arcade.Sprite;
    platform.setOrigin(0.5, 0.5);
    platform.displayWidth = width * 2;
    platform.displayHeight = GROUND_HEIGHT * 1.5;
    platform.setDepth(1000);
    platform.setBounce(0);
    platform.setImmovable(true);
    platform.refreshBody();

    this.player = this.physics.add.sprite(
      this.targetX || width / 2,
      height,
      "player_main_sprite",
    );
    this.player
      .setOrigin(0.5, 1)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setGravityY(500);
    this.player.body?.setSize(50, 150);
    this.player.setDepth(2000);

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player_main_sprite", { start: 0, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_main_sprite", { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1,
    });

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    this.input.addPointer(1);

    this.cameras.main.setOrigin(0.5, 1);
    this.cameras.main.startFollow(this.player, true, 0.5, 1, 0, height / 2);
    this.cameras.main.setDeadzone(width * 0.1, 0);

    this.physics.add.collider(this.player, this.platforms);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.scale.on("resize", this.resizeGame, this);
  }

  resizeGame(gameSize: { width: number; height: number }) {
    const { width, height } = gameSize;
    console.log("gamesize width, height: ", width, height);

    if (this.background) {
      this.background.displayWidth = width;
      this.background.displayHeight = height;
    }

    if (this.platforms && this.platforms.getChildren().length > 0) {
      const platform = this.platforms.getChildren()[0] as Phaser.Physics.Arcade.Sprite;
      platform.setX(width / 2);
      platform.setY(height);
      platform.setOrigin(0.5, 1);
      platform.displayWidth = width;
      platform.displayHeight = GROUND_HEIGHT;
      platform.refreshBody();
    }

    if (this.player) {
      this.player.setX(this.targetX || width / 2);
      this.player.setY(height - GROUND_HEIGHT);
    }

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
      this.platforms.setX(this.player.x);
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

      this.background.tilePositionX += this.player.body.velocity.x * speedFactor * this.game.loop.delta / 1000;
    }
  }
}
