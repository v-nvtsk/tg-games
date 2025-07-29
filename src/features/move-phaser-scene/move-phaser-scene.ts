import { Scene } from "phaser";
import { createTiledBackground, getAssetsPathByType } from "$/utils";
import type { MoveSceneData } from "@core/types/common-types";
import { useMoveSceneStore } from "$/core/state/move-scene-store";
import { useSceneStore } from "../../core/state";

const GROUND_HEIGHT = 50;
const PLAYER_GRAVITY = 500;
const PLAYER_BOUNCE = 0.2;
const PLAYER_SPEED = 150;
const PLAYER_FRAME_RATE = 16;
const NUM_PLAYER_FRAMES = 15;
const NUM_START_FRAMES = 7;

const PARALLAX_FACTORS = {
  background: 0.1,
  preBackground: 0.3,
  light: 0.6,
  front: 1.0,
};

export class MovePhaserScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveLeft = false;
  private moveRight = false;
  private isMoving = false;

  private parallaxBackground!: Phaser.GameObjects.TileSprite;
  private parallaxPreBackground!: Phaser.GameObjects.TileSprite;
  private parallaxLight!: Phaser.GameObjects.TileSprite;
  private parallaxFront!: Phaser.GameObjects.TileSprite;

  private targetX: number | null = null;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("MoveScene");
  }

  init(data: MoveSceneData): void {
    this.targetX = data?.targetX ?? 0;
  }

  preload(): void {
    for (let i = 1; i <= NUM_START_FRAMES; i++) {
      this.load.image(`player_start_${i}`, getAssetsPathByType({ type: "images",
        filename: `alex/start_${i}.png` }));
    }
    for (let i = 1; i <= NUM_PLAYER_FRAMES; i++) {
      this.load.image(`player_cycle_${i}`, getAssetsPathByType({ type: "images",
        filename: `alex/cycle_${i}.png` }));
    }

    const { backgroundLayers } = useSceneStore.getState();

    this.load.image("parallax/background", backgroundLayers?.background);
    this.load.image("parallax/pre-background", backgroundLayers?.preBackground);
    this.load.image("parallax/light", backgroundLayers?.light);
    this.load.image("parallax/front", backgroundLayers?.front);
    this.load.image("ground", backgroundLayers?.ground);
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    this.createParallaxLayers(width, height);
    this.createPlatforms();
    this.createPlayer();
    this.createAnimations();
    this.setupInputHandling();
    this.setupCamera();

    this.physics.add.collider(this.player, this.platforms);
    this.scale.on("resize", this.handleResize, this);

    // useMoveSceneStore.getState().startQuizCycle();
  }

  destroy(): void {
    console.log("MoveScene: destroy() — очищена сцена");
  }

  private handleResize = (gameSize: Phaser.Structs.Size): void => {
    const { width, height } = gameSize;
    this.resizeParallaxLayers(width, height);
    if (this.platforms.getChildren().length) {
      const platform = this.platforms.getChildren()[0] as Phaser.Physics.Arcade.Sprite;
      this.resizePlatform(platform, width, height);
      platform.refreshBody();
    }
    if (this.player) {
      this.player.setX(this.targetX || width / 2);
      this.player.setY(height - GROUND_HEIGHT);
    }
    this.cameras.main.setSize(width, height);
  };

  private createParallaxLayers(width: number, height: number): void {
    this.parallaxBackground = createTiledBackground(this, "parallax/background").setOrigin(0, 0)
      .setDepth(0);
    this.parallaxPreBackground = createTiledBackground(this, "parallax/pre-background").setOrigin(0, 0)
      .setDepth(1);
    this.parallaxLight = createTiledBackground(this, "parallax/light").setOrigin(0, 0)
      .setDepth(2);
    this.parallaxFront = createTiledBackground(this, "parallax/front").setOrigin(0, 0)
      .setDepth(3);
    this.resizeParallaxLayers(width, height);
  }

  private createPlatforms(): void {
    const { width, height } = this.sys.game.canvas;
    this.platforms = this.physics.add.staticGroup();
    const platform = this.platforms.create(0, height, "ground") as Phaser.Physics.Arcade.Sprite;
    platform.setOrigin(0.5, 0.5).setDepth(-1000)
      .setBounce(0)
      .setImmovable(true)
      .setAlpha(0);
    this.resizePlatform(platform, width, height);
    platform.refreshBody();
  }

  private createPlayer(): void {
    const { width, height } = this.sys.game.canvas;
    this.player = this.physics.add.sprite(this.targetX || width / 2, height, "player_start_1");
    this.player.setOrigin(0.5, 1).setCollideWorldBounds(true)
      .setBounce(PLAYER_BOUNCE)
      .setGravityY(PLAYER_GRAVITY)
      .setDepth(2);
  }

  private createAnimations(): void {
    this.anims.create({ key: "idle",
      frames: [{ key: "player_start_1" }],
      frameRate: PLAYER_FRAME_RATE,
      repeat: 0 });
    this.anims.create({ key: "start_walking",
      frames: Array.from({ length: NUM_START_FRAMES }, (_, i) => ({ key: `player_start_${i + 1}` })),
      frameRate: PLAYER_FRAME_RATE,
      repeat: 0 });
    this.anims.create({ key: "walk",
      frames: Array.from({ length: NUM_PLAYER_FRAMES }, (_, i) => ({ key: `player_cycle_${i + 1}` })),
      frameRate: PLAYER_FRAME_RATE,
      repeat: -1 });
  }

  private setupInputHandling(): void {
    if (this.input.keyboard) this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      if (pointer.x < this.sys.game.canvas.width / 2) {
        this.moveLeft = true;
        this.moveRight = false;
      } else {
        this.moveRight = true;
        this.moveLeft = false;
      }
    });

    this.input.on(Phaser.Input.Events.POINTER_UP, () => {
      this.moveLeft = false;
      this.moveRight = false;
    });
  }

  private setupCamera(): void {
    const { width, height } = this.sys.game.canvas;
    this.cameras.main.setOrigin(0.5, 1);
    this.cameras.main.startFollow(this.player, true, 0.5, 1, 0, height / 2);
    this.cameras.main.setDeadzone(width * 0.1, 0);
  }

  update(_time: number, _delta: number): void {
    // ✅ Останавливаем движение, если открыт квиз
    if (useMoveSceneStore.getState().isQuizVisible) {
      this.isMoving = false;
      this.player?.setVelocityX(0);
      this.player?.anims.stop();
      if (this.player && this.player.anims.currentAnim?.key !== "idle") {
        this.player.anims.play("idle", true);
      }
      return;
    }

    if (!this.player || !this.player.body) return;
    const onGround = this.player.body.touching.down;
    if (onGround) this.player.setVelocityY(0);

    if (this.cursors) {
      if (this.moveLeft || this.cursors.left.isDown) {
        this.handleMovementState(true);
        this.player.setVelocityX(-PLAYER_SPEED);
        this.player.setFlipX(true);
      } else if (this.moveRight || this.cursors.right.isDown) {
        this.handleMovementState(true);
        this.player.setVelocityX(PLAYER_SPEED);
        this.player.setFlipX(false);
      } else {
        this.handleMovementState(false);
        this.player.setVelocityX(0);
      }
      this.platforms.setX(this.player.x);
    }

    if (this.player.body.velocity.x !== 0) {
      const speedFactor = this.player.body.velocity.x * this.game.loop.delta / 1000;
      this.parallaxBackground.tilePositionX += speedFactor * PARALLAX_FACTORS.background;
      this.parallaxPreBackground.tilePositionX += speedFactor * PARALLAX_FACTORS.preBackground;
      this.parallaxLight.tilePositionX += speedFactor * PARALLAX_FACTORS.light;
      this.parallaxFront.tilePositionX += speedFactor * PARALLAX_FACTORS.front;
    }
  }

  private handleMovementState(isMoving: boolean): void {
    if (isMoving && !this.isMoving) {
      this.isMoving = true;
      this.player.play("start_walking", true);
      this.player.once("animationcomplete", () => {
        if (this.isMoving) this.player.play("walk", true);
      });
    } else if (!isMoving && this.isMoving) {
      this.isMoving = false;
      this.player.play("idle", true);
    }
  }

  private resizeParallaxLayers(width: number, height: number): void {
    [this.parallaxBackground, this.parallaxPreBackground, this.parallaxLight, this.parallaxFront].forEach((layer) => {
      if (layer) {
        layer.displayWidth = width;
        layer.displayHeight = height;
      }
    });
  }

  private resizePlatform(platform: Phaser.Physics.Arcade.Sprite, width: number, height: number): void {
    platform.setX(width / 2);
    platform.setY(height);
    platform.displayWidth = width * 2;
    platform.displayHeight = GROUND_HEIGHT * 1.5;
  }
}
