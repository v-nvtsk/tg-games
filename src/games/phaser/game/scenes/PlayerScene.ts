import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class PlayerScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveLeft = false;
  private moveRight = false;

  constructor() {
    super("PlayerScene");
  }

  preload(): void {
    // Загружаем спрайты
    this.load.spritesheet("player_walk", "assets/walk.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("player_idle", "assets/idle.png", {
      frameWidth: 128,
      frameHeight: 128,
    });

    // Загружаем платформу
    this.load.image("ground", "assets/ground.png");

    // Загружаем уровень
    this.load.json("level1", "assets/levels/level1.json");
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Создаём игрока
    this.player = this.physics.add.sprite(width / 2, height - 100, "player_idle");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2); // лёгкий отскок от земли

    // Анимации
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player_walk", { start: 0, end: 9 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    // Управление
    if (this.input.keyboard)
      this.cursors = this.input.keyboard.createCursorKeys();

    // Камера следует за игроком
    this.cameras.main.startFollow(this.player);

    // Загружаем уровень
    const levelData = this.cache.json.get("level1") as unknown as { platforms: { x: number; y: number }[]; };
    const platforms = this.physics.add.staticGroup();

    levelData.platforms.forEach((plat: { x: number; y: number }) => {
      const platform = platforms.create(plat.x, plat.y, "ground") as Phaser.Physics.Arcade.Sprite;
      platform.setImmovable(true);
      platform.setScale(2);
      platform.refreshBody();
    });

    // Коллизия игрока с платформами
    this.physics.add.collider(this.player, platforms);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const width = this.scale.width;
      const height = this.scale.height;
      const { x, y } = pointer;

      if (x < width / 4) {
        // Левая часть экрана - движение влево
        this.moveLeft = true;
      } else if (x > (width * 3) / 4) {
        // Правая часть экрана - движение вправо
        this.moveRight = true;
      } else if (y < height / 2) {
        // Верхняя половина экрана - прыжок
        this.player.setVelocityY(-300);
      }
    });

    // Сбрасываем флаги движения при отпускании
    this.input.on("pointerup", () => {
      this.moveLeft = false;
      this.moveRight = false;
    });

    // Сообщаем, что сцена готова
    EventBus.emit("current-scene-ready", this);
  }

  update(): void {
    // Обработка движения через касания
    if (this.moveLeft) {
      this.player.setVelocityX(-200);
      if (this.player.anims.currentAnim?.key !== "walk") {
        this.player.play("walk", true);
      }
      this.player.setFlipX(true);
    } else if (this.moveRight) {
      this.player.setVelocityX(200);
      if (this.player.anims.currentAnim?.key !== "walk") {
        this.player.play("walk", true);
      }
      this.player.setFlipX(false);
    } else {
      // Остановка при отсутствии движения
      this.player.setVelocityX(0);
      if (this.player.anims.currentAnim?.key !== "idle") {
        this.player.play("idle", true);
      }
    }

    // Существующая обработка клавиатуры
    if (this.cursors.left.isDown) {
      // ... существующий код ...
    } else if (this.cursors.right.isDown) {
      // ... существующий код ...
    } else if (this.cursors.up.isDown) {
      // ... существующий код ...
    }
  }

}
