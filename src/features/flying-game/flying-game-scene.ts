import { Scene } from "phaser";
import { setBackground } from "../../utils/set-background";
import { getAssetsPathByType } from "../../utils/get-assets-path";

// --- Константы для игры ---
const PLAYER_SIZE = 60;
const PLAYER_SPEED = 300;
const OBJECT_SPEED = 200;
const OBSTACLE_HEIGHT = 32; // <--- ИЗМЕНЕНО: Соответствует размеру rock.png
const COIN_SIZE = 40;
const LEVEL_ELEMENT_SPACING = 1500;

const SCORE_TEXT_STYLE = { fontSize: "32px",
  color: "#ffffff" };

// <--- ИЗМЕНЕНО: Увеличиваем минимальный проход для безопасности
const MIN_PASSAGE_WIDTH = PLAYER_SIZE * 3;
const HORIZONTAL_BUFFER = 50; // Отступ от краев экрана для препятствий

const COIN_SPAWN_CHANCE = 0.7;

// --- Ключи текстур ---
const PLAYER_TEXTURE_KEY = "player_texture";
const ROCK_TEXTURE_KEY = "rock";
const COIN_TEXTURE_KEY = "coin";

interface PooledObject extends Phaser.Physics.Arcade.Sprite {
  body: Phaser.Physics.Arcade.Body;
}

// Универсальный тип для объектов, которые Phaser передает в колбэки физики
type PhysicsCallbackObject =
  | Phaser.GameObjects.GameObject
  | Phaser.Physics.Arcade.Body
  | Phaser.Physics.Arcade.StaticBody
  | Phaser.Tilemaps.Tile;

export class FlyingGameScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private rocks!: Phaser.Physics.Arcade.Group;
  private coins!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver = false;

  private isDraggingPlayer = false;
  private dragStartX = 0;
  private dragPlayerStartX = 0;

  constructor() {
    super("FlyingGameScene");
  }

  preload() {
    // this.load.image("background", "assets/images/background.png");

    this.textures.createCanvas(PLAYER_TEXTURE_KEY, PLAYER_SIZE, PLAYER_SIZE);
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x0000ff, 1);
    playerGraphics.fillRect(0, 0, PLAYER_SIZE, PLAYER_SIZE);
    playerGraphics.generateTexture(PLAYER_TEXTURE_KEY, PLAYER_SIZE, PLAYER_SIZE);
    playerGraphics.destroy();

    this.load.image(ROCK_TEXTURE_KEY, getAssetsPathByType({
      type: "images",
      scene: "flying",
      filename: "rock6_3.png",
    }));

    this.load.image(COIN_TEXTURE_KEY, getAssetsPathByType({
      type: "images",
      scene: "flying",
      filename: "coin.png",
    }));
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

    this.rocks = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    this.coins = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    for (let i = 0; i < 50; i++) {
      const rock = this.rocks.create(0, 0, ROCK_TEXTURE_KEY) as PooledObject;
      rock.setOrigin(0, 0); // Origin для камня
      rock.setActive(false).setVisible(false)
        .setSize(OBSTACLE_HEIGHT, OBSTACLE_HEIGHT);
      if (rock.body) {
        rock.body.setAllowGravity(false);
        rock.body.enable = false;
      }
    }

    for (let i = 0; i < 50; i++) {
      const coin = this.coins.create(0, 0, COIN_TEXTURE_KEY) as PooledObject;
      coin.setOrigin(0.5, 0.5); // Origin для монетки
      coin.setActive(false).setVisible(false);
      if (coin.body) {
        coin.body.setAllowGravity(false);
        coin.body.enable = false;
        coin.body.setCircle(COIN_SIZE / 2);
      }
    }

    this.score = 0;
    this.scoreText = this.add
      .text(16, 16, "Очки: 0", SCORE_TEXT_STYLE)
      .setDepth(1);

    this.cursors = this.input.keyboard ? this.input.keyboard.createCursorKeys() : {} as Phaser.Types.Input.Keyboard.CursorKeys;

    this.input.on("pointerdown", this.onScenePointerDown.bind(this), this);
    this.input.on("pointermove", this.onScenePointerMove.bind(this), this);
    this.input.on("pointerup", this.onScenePointerUp.bind(this), this);

    this.time.addEvent({
      delay: LEVEL_ELEMENT_SPACING,
      callback: this.spawnLevelElements.bind(this),
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.player,
      this.rocks,
      this.hitObstacle.bind(this),
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin.bind(this),
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

    this.rocks.children.each((gameObject: Phaser.GameObjects.GameObject) => {
      const rock = gameObject as PooledObject;
      if (rock.active && rock.body) {
        rock.body.setVelocityY(OBJECT_SPEED);

        if (rock.y > this.scale.height) {
          rock.setActive(false).setVisible(false);
          rock.body.enable = false;
        }
      }
      return true;
    });

    this.coins.children.each((gameObject: Phaser.GameObjects.GameObject) => {
      const coin = gameObject as PooledObject;
      if (coin.active && coin.body) {
        coin.body.setVelocityY(OBJECT_SPEED);

        if (coin.y > this.scale.height) {
          coin.setActive(false).setVisible(false);
          coin.body.enable = false;
        }
      }
      return true;
    });
  }

  private onScenePointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.gameOver) {
      return;
    }

    if (Phaser.Geom.Rectangle.Contains(this.player.getBounds(), pointer.x, pointer.y)) {
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

  private getPooledRock(): PooledObject | null {
    const rock = this.rocks.getFirstDead(false) as PooledObject | null;
    if (rock && rock.body) {
      rock.setActive(true).setVisible(true);
      rock.body.enable = true;
      return rock;
    }
    return null;
  }

  private getPooledCoin(): PooledObject | null {
    const coin = this.coins.getFirstDead(false) as PooledObject | null;
    if (coin && coin.body) {
      coin.setActive(true).setVisible(true);
      coin.body.enable = true;
      return coin;
    }
    return null;
  }

  private spawnLevelElements(): void {
    if (this.gameOver) return;

    const screenWidth = this.scale.width;
    const spawnY = -OBSTACLE_HEIGHT; // Появляются сверху, на высоте одного камня

    // 1. Определяем ширину прохода.
    const minPassage = MIN_PASSAGE_WIDTH;
    const maxPassage = screenWidth - (2 * HORIZONTAL_BUFFER);

    const actualPassageWidth = Phaser.Math.Between(minPassage, Math.max(minPassage, maxPassage));

    // 2. Определяем X-координату начала прохода.
    const passageStartXMin = HORIZONTAL_BUFFER;
    const passageStartXMax = screenWidth - actualPassageWidth - HORIZONTAL_BUFFER;

    const passageStartX = Phaser.Math.Between(passageStartXMin, Math.max(passageStartXMin, passageStartXMax));
    const passageEndX = passageStartX + actualPassageWidth;

    // 3. Спавним индивидуальные камни (32x32)
    // Левая часть препятствия
    for (let x = 0; x < passageStartX; x += OBSTACLE_HEIGHT) { // Шаг равен ширине камня
      const rock = this.getPooledRock();
      if (rock) {
        rock.x = x;
        rock.y = spawnY;
        rock.displayWidth = OBSTACLE_HEIGHT; // Задаем размер спрайта 32x32
        rock.displayHeight = OBSTACLE_HEIGHT;
        rock.body.setSize(OBSTACLE_HEIGHT, OBSTACLE_HEIGHT); // Размер физического тела 32x32
        rock.body.setOffset(0, 0);
        rock.body.setVelocityY(OBJECT_SPEED);
        rock.setActive(true).setVisible(true);
      }
    }

    // Правая часть препятствия
    for (let x = passageEndX; x < screenWidth; x += OBSTACLE_HEIGHT) { // Начинаем от конца прохода
      const rock = this.getPooledRock();
      if (rock) {
        rock.x = x;
        rock.y = spawnY;
        rock.displayWidth = OBSTACLE_HEIGHT;
        rock.displayHeight = OBSTACLE_HEIGHT;
        rock.body.setSize(OBSTACLE_HEIGHT, OBSTACLE_HEIGHT);
        rock.body.setOffset(0, 0);
        rock.body.setVelocityY(OBJECT_SPEED);
        rock.setActive(true).setVisible(true);
      }
    }

    // Шанс спавна монетки в проходе
    if (Math.random() < COIN_SPAWN_CHANCE) {
      const coin = this.getPooledCoin();
      if (coin) {
        const coinX = passageStartX + actualPassageWidth / 2;
        // Позиционируем монетку вертикально по центру линии препятствий
        const coinY = spawnY + OBSTACLE_HEIGHT / 2;

        coin.x = coinX;
        coin.y = coinY;
        coin.displayWidth = COIN_SIZE;
        coin.displayHeight = COIN_SIZE;
        coin.body.setCircle(COIN_SIZE / 2);
        coin.body.setVelocityY(OBJECT_SPEED);
        coin.setActive(true).setVisible(true);
      }
    }
  }

  // Обработчик столкновения с препятствием
  private hitObstacle(_playerObj: PhysicsCallbackObject, _rockObj: PhysicsCallbackObject): void {
    this.gameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000);

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `Игра окончена!\nОчки: ${this.score}\nНажмите или SPACE для перезапуска`,
      { fontSize: "48px",
        color: "#ff0000",
        align: "center" },
    ).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.restart();
    });
    this.input.keyboard?.once("keydown-SPACE", () => {
      this.restart();
    });
  }

  // Обработчик сбора монетки
  private collectCoin(_playerObj: PhysicsCallbackObject, coinObject: PhysicsCallbackObject): void {
    // Безопасно проверяем, является ли объект спрайтом, прежде чем пытаться им манипулировать
    if (coinObject instanceof Phaser.GameObjects.Sprite) {
      const coin = coinObject as PooledObject;
      coin.disableBody(true, true); // Деактивируем и скрываем монетку

      this.score += 10; // Начисляем очки за монетку
      this.scoreText.setText(`Очки: ${this.score}`);
    } else {
      console.warn("Attempted to collect a non-sprite object as a coin.", coinObject);
    }
  }

  private restart(): void {
    this.gameOver = false;
    this.score = 0;
    this.player.clearTint();
    this.physics.resume();

    this.rocks.children.each((gameObject: Phaser.GameObjects.GameObject) => {
      const pooledObject = gameObject as PooledObject;
      pooledObject.setActive(false).setVisible(false);
      if (pooledObject.body) pooledObject.body.enable = false;
      return true;
    });
    this.coins.children.each((gameObject: Phaser.GameObjects.GameObject) => {
      const pooledObject = gameObject as PooledObject;
      pooledObject.setActive(false).setVisible(false);
      if (pooledObject.body) pooledObject.body.enable = false;
      return true;
    });

    this.scene.restart();
  }
}
