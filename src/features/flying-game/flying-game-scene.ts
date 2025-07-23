import { Scene } from "phaser";
import { setBackground } from "../../utils/set-background";

const PLAYER_COLOR = 0x0000ff;
const OBSTACLE_COLOR = 0x808080;

const PLAYER_SIZE = 60;
const PLAYER_SPEED = 300;
const OBSTACLE_HEIGHT = 20;
const OBSTACLE_SPEED = 200;
const OBSTACLE_SPACING = 1800;
const OBSTACLE_POOL_SIZE = 100;
const SCORE_TEXT_STYLE = { fontSize: "32px",
  color: "#ffffff" };

const MIN_PASSAGE_WIDTH = PLAYER_SIZE * 2.5;
const HORIZONTAL_BUFFER = 50;

const PLAYER_TEXTURE_KEY = "player_texture";
const OBSTACLE_TEXTURE_KEY = "obstacle_texture";

interface PooledObstacle extends Phaser.Physics.Arcade.Sprite {
  body: Phaser.Physics.Arcade.Body;
}

export class FlyingGameScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver = false;
  private lastObstacleX = 0;
  private lastObstacleWidth = 0;

  private isDraggingPlayer = false;
  private dragStartX = 0;
  private dragPlayerStartX = 0;

  constructor() {
    super("FlyingGameScene");
  }

  preload() {
    this.load.image("background", "assets/images/background.png");

    this.textures.createCanvas(PLAYER_TEXTURE_KEY, PLAYER_SIZE, PLAYER_SIZE);
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(PLAYER_COLOR, 1);
    playerGraphics.fillRect(0, 0, PLAYER_SIZE, PLAYER_SIZE);
    playerGraphics.generateTexture(PLAYER_TEXTURE_KEY, PLAYER_SIZE, PLAYER_SIZE);
    playerGraphics.destroy();

    this.textures.createCanvas(OBSTACLE_TEXTURE_KEY, this.scale.width, OBSTACLE_HEIGHT);
    const obstacleGraphics = this.add.graphics();
    obstacleGraphics.fillStyle(OBSTACLE_COLOR, 1);
    obstacleGraphics.fillRect(0, 0, this.scale.width, OBSTACLE_HEIGHT);
    obstacleGraphics.generateTexture(OBSTACLE_TEXTURE_KEY, this.scale.width, OBSTACLE_HEIGHT);
    obstacleGraphics.destroy();
  }

  create() {
    setBackground(this, "background", true);

    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x444444,
    );

    this.player = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height - PLAYER_SIZE * 2,
      PLAYER_TEXTURE_KEY,
    );
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(PLAYER_SIZE, PLAYER_SIZE, true);

    this.player.setInteractive();

    this.obstacles = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    for (let i = 0; i < OBSTACLE_POOL_SIZE; i++) {
      const obstacle = this.obstacles.create(
        0, 0, OBSTACLE_TEXTURE_KEY,
      ) as PooledObstacle;
      obstacle.setOrigin(0, 0);
      obstacle.setActive(false).setVisible(false);
      if (obstacle.body) {
        obstacle.body.setAllowGravity(false);
        obstacle.body.enable = false;
      }
    }

    this.scoreText = this.add
      .text(16, 16, "Счет: 0", SCORE_TEXT_STYLE)
      .setDepth(1);

    this.cursors = this.input.keyboard ? this.input.keyboard.createCursorKeys() : {} as Phaser.Types.Input.Keyboard.CursorKeys;

    this.input.on("pointerdown", this.onScenePointerDown.bind(this));
    this.input.on("pointermove", this.onScenePointerMove.bind(this));
    this.input.on("pointerup", this.onScenePointerUp.bind(this));

    this.time.addEvent({
      delay: OBSTACLE_SPACING,
      callback: this.spawnObstacle.bind(this),
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.hitObstacle.bind(this),
      undefined,
      this,
    );
  }

  update(_time: number, _delta: number) {
    if (this.gameOver) {
      return;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    if (playerBody && !this.input.activePointer.isDown) {
      playerBody.setVelocityX(0);

      if (this.cursors.left?.isDown) {
        playerBody.setVelocityX(-PLAYER_SPEED);
      } else if (this.cursors.right?.isDown) {
        playerBody.setVelocityX(PLAYER_SPEED);
      }
    }

    this.obstacles.children.each((obstacleObject: Phaser.GameObjects.GameObject) => {
      const obstacle = obstacleObject as PooledObstacle;
      if (obstacle.active && obstacle.body) {
        obstacle.body.setVelocityY(OBSTACLE_SPEED);

        if (obstacle.y > this.scale.height) {
          this.score += 1;
          this.scoreText.setText(`Счет: ${this.score}`);
          obstacle.setActive(false).setVisible(false);
          obstacle.body.enable = false;
        }
      }
      return true;
    });
  }

  private onScenePointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.gameOver) {
      return;
    }

    const gameObjectsUnderPointer = this.input.manager.pointers.filter((p) =>
      Phaser.Geom.Rectangle.Contains(this.player.getBounds(), p.x, p.y),
    );

    if (gameObjectsUnderPointer) {
      this.isDraggingPlayer = true;
      this.dragStartX = pointer.x;
      this.dragPlayerStartX = this.player.x;
      (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
    } else {
      this.isDraggingPlayer = false;
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      if (playerBody) {
        if (pointer.x < this.player.x) {
          playerBody.setVelocityX(-PLAYER_SPEED * 1.5);
        } else {
          playerBody.setVelocityX(PLAYER_SPEED * 1.5);
        }
        this.time.delayedCall(100, () => {
          if (!pointer.isDown && !this.isDraggingPlayer) {
            playerBody.setVelocityX(0);
          }
        });
      }
    }
  }

  private onScenePointerMove(pointer: Phaser.Input.Pointer): void {
    if (this.gameOver) {
      return;
    }

    if (this.isDraggingPlayer && pointer.isDown) {
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      if (playerBody) {
        const newPlayerX = this.dragPlayerStartX + (pointer.x - this.dragStartX);
        this.player.x = Phaser.Math.Clamp(newPlayerX, PLAYER_SIZE / 2, this.scale.width - PLAYER_SIZE / 2);
        playerBody.setVelocityX(0);
      }
    }
  }

  private onScenePointerUp(): void {
    if (this.gameOver) {
      return;
    }
    this.isDraggingPlayer = false;
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (playerBody) {
      playerBody.setVelocityX(0);
    }
  }

  private getPooledObstacle(): PooledObstacle | null {
    const obstacle = this.obstacles.getFirstDead(false) as PooledObstacle | null;
    if (obstacle && obstacle.body) {
      obstacle.setActive(true).setVisible(true);
      obstacle.body.enable = true;
      return obstacle;
    }
    return null;
  }

  private spawnObstacle(): void {
    if (this.gameOver) return;

    const width = this.scale.width;

    const obstacle = this.getPooledObstacle();
    if (!obstacle || !obstacle.body) return;

    let minX = HORIZONTAL_BUFFER;
    let maxX = width - HORIZONTAL_BUFFER;

    if (this.lastObstacleX !== 0) {
      const safeZoneStart = this.lastObstacleX - MIN_PASSAGE_WIDTH * 2;
      const safeZoneEnd = this.lastObstacleX + this.lastObstacleWidth + MIN_PASSAGE_WIDTH * 2;

      if (this.lastObstacleX < width / 2) {
        maxX = Math.min(maxX, safeZoneEnd);
      } else {
        minX = Math.max(minX, safeZoneStart);
      }
    }

    const minObstacleWidth = MIN_PASSAGE_WIDTH * 1.2;
    const maxObstacleWidth = width - MIN_PASSAGE_WIDTH * 2;
    const obstacleWidth = Phaser.Math.Between(minObstacleWidth, maxObstacleWidth);

    let x: number;

    const passageOnRight = Math.random() < 0.5;

    if (passageOnRight) {
      x = Phaser.Math.Between(minX, width - obstacleWidth - MIN_PASSAGE_WIDTH);
    } else {
      x = Phaser.Math.Between(MIN_PASSAGE_WIDTH + minX, width - obstacleWidth);
    }

    if (x < minX) x = minX;
    if (x + obstacleWidth > maxX) x = maxX - obstacleWidth;

    obstacle.x = x;
    obstacle.y = -OBSTACLE_HEIGHT;
    obstacle.displayWidth = obstacleWidth;
    obstacle.displayHeight = OBSTACLE_HEIGHT;

    obstacle.body.setSize(obstacleWidth, OBSTACLE_HEIGHT);
    obstacle.body.setOffset(0, 0);
    obstacle.body.setAllowGravity(false);
    obstacle.body.setVelocityY(OBSTACLE_SPEED);

    obstacle.setActive(true).setVisible(true);

    this.lastObstacleX = x;
    this.lastObstacleWidth = obstacleWidth;
  }

  private hitObstacle(): void {
    this.gameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `Игра окончена!\nСчет: ${this.score}\nНажмите для перезапуска`,
      { fontSize: "48px",
        color: "#ff0000",
        align: "center" },
    ).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.restart();
    });
    this.input.keyboard?.once("keydown_SPACE", () => {
      this.restart();
    });
  }

  private restart(){
    this.lastObstacleX = 0;
    this.lastObstacleWidth = 0;
    this.scene.restart({});
    this.gameOver = false;
    this.physics.resume();

  }
}
