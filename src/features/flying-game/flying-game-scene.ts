// src/features/flying-game/flying-game-scene.ts

import { Scene } from "phaser";
import { setBackground as _setBackground } from "../../utils/set-background";

// Определения цветов
const PLAYER_COLOR = 0x0000ff; // Синий (используем числовой формат для Phaser)
const OBSTACLE_COLOR = 0x808080; // Серый (используем числовой формат для Phaser)

// Константы игры
const PLAYER_SIZE = 60;
const PLAYER_SPEED = 300;
const OBSTACLE_HEIGHT = 150;
// так как препятствия состоят из двух динамически изменяемых частей.
// Оставлена для справки, если вы захотите ее использовать иначе.
const OBSTACLE_SPEED = 200;
const OBSTACLE_SPACING = 800; // Расстояние между появлениями препятствий по вертикали (оставлено без изменений)
const MIN_OPENING_WIDTH = PLAYER_SIZE * 2.5; // Минимальная ширина прохода - теперь это фиксированная ширина прохода!
const OBSTACLE_POOL_SIZE = 10; // Размер пула препятствий (достаточно для 5 пар препятствий)
const SCORE_TEXT_STYLE = { fontSize: "32px",
  color: "#ffffff" };

// Ключи текстур для сгенерированных изображений
const PLAYER_TEXTURE_KEY = "player_texture";
const OBSTACLE_TEXTURE_KEY = "obstacle_texture";

// Интерфейс для расширения объектов препятствий в пуле
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

  // Новые переменные для управления перетаскиванием
  private isDraggingPlayer = false;
  private dragStartX = 0; // Начальная X-координата указателя при начале перетаскивания
  private dragPlayerStartX = 0; // Начальная X-координата игрока при начале перетаскивания

  constructor() {
    super("FlyingGameScene");
  }

  preload() {
    // Если у вас есть фоновое изображение, загрузите его здесь
    // this.load.image('background', 'assets/images/background.png');

    // Генерируем изображение игрока (квадрат)
    this.textures.createCanvas(PLAYER_TEXTURE_KEY, PLAYER_SIZE, PLAYER_SIZE);
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(PLAYER_COLOR, 1);
    playerGraphics.fillRect(0, 0, PLAYER_SIZE, PLAYER_SIZE);
    playerGraphics.generateTexture(PLAYER_TEXTURE_KEY, PLAYER_SIZE, PLAYER_SIZE);
    playerGraphics.destroy(); // Удаляем графический объект, он больше не нужен

    // Генерируем изображение препятствия (прямоугольник максимальной ширины)
    this.textures.createCanvas(OBSTACLE_TEXTURE_KEY, this.scale.width, OBSTACLE_HEIGHT);
    const obstacleGraphics = this.add.graphics();
    obstacleGraphics.fillStyle(OBSTACLE_COLOR, 1);
    obstacleGraphics.fillRect(0, 0, this.scale.width, OBSTACLE_HEIGHT); // Рисуем прямоугольник на всю ширину холста
    obstacleGraphics.generateTexture(OBSTACLE_TEXTURE_KEY, this.scale.width, OBSTACLE_HEIGHT);
    obstacleGraphics.destroy(); // Удаляем графический объект
  }

  create() {
    // Установка фона, если есть. Раскомментируйте, если вы хотите использовать изображение.
    // _setBackground(this, 'background', true);

    // Добавляем простой фон, если нет изображения
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x444444,
    );

    // Игрок
    this.player = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height - PLAYER_SIZE * 2,
      PLAYER_TEXTURE_KEY, // Используем сгенерированную текстуру
    );
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(PLAYER_SIZE, PLAYER_SIZE, true); // Установка размера тела

    // Делаем игрока интерактивным, чтобы можно было определить, был ли клик по нему
    this.player.setInteractive();

    // Группа для препятствий (используем пулы для производительности)
    this.obstacles = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    // Создаем пул препятствий (невидимые и неактивные)
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

    // Текст счета
    this.scoreText = this.add
      .text(16, 16, "Счет: 0", SCORE_TEXT_STYLE)
      .setDepth(1);

    // Ввод с клавиатуры
    this.cursors = this.input.keyboard ? this.input.keyboard.createCursorKeys() : {} as Phaser.Types.Input.Keyboard.CursorKeys;

    // ОБРАБОТЧИКИ УПРАВЛЕНИЯ КАСАНИЕМ/МЫШЬЮ
    this.input.on("pointerdown", this.onScenePointerDown.bind(this));
    this.input.on("pointermove", this.onScenePointerMove.bind(this));
    this.input.on("pointerup", this.onScenePointerUp.bind(this));

    // Генерация препятствий с интервалом
    this.time.addEvent({
      delay: OBSTACLE_SPACING,
      callback: this.spawnObstacle.bind(this),
      callbackScope: this,
      loop: true,
    });

    // Обработка столкновений
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

    // Управление игроком с клавиатуры (активно только если нет активного касания/перетаскивания)
    if (playerBody && !this.input.activePointer.isDown) {
      playerBody.setVelocityX(0);

      if (this.cursors.left?.isDown) {
        playerBody.setVelocityX(-PLAYER_SPEED);
      } else if (this.cursors.right?.isDown) {
        playerBody.setVelocityX(PLAYER_SPEED);
      }
    }

    // Перемещение препятствий и переработка
    this.obstacles.children.each((obstacleObject: Phaser.GameObjects.GameObject) => {
      const obstacle = obstacleObject as PooledObstacle;
      if (obstacle.active && obstacle.body) {
        obstacle.body.setVelocityY(OBSTACLE_SPEED);

        // Если препятствие выходит за нижнюю границу экрана
        if (obstacle.y > this.scale.height) {
          // Увеличиваем счет, но только один раз за пару препятствий.
          // Чтобы избежать двойного начисления очков за одну пару,
          // можно ввести флаг на одном из препятствий или считать очки
          // при создании новой пары, когда предыдущая полностью вышла за экран.
          // Пока что оставлю так, как было, но имейте в виду этот нюанс.
          this.score += 1;
          this.scoreText.setText(`Счет: ${this.score}`);
          obstacle.setActive(false).setVisible(false);
          obstacle.body.enable = false;
        }
      }
      return true;
    });
  }

  // ОБРАБОТЧИКИ НОВОГО УПРАВЛЕНИЯ
  private onScenePointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.gameOver) {
      return;
    }

    // Проверяем, было ли касание/клик по игроку
    const gameObjectsUnderPointer = this.input.manager.pointers.filter((p) =>
      Phaser.Geom.Rectangle.Contains(this.player.getBounds(), p.x, p.y),
    );

    if (gameObjectsUnderPointer) {
      // Клик/касание НА игроке: начинаем режим перетаскивания
      this.isDraggingPlayer = true;
      this.dragStartX = pointer.x;
      this.dragPlayerStartX = this.player.x;
      // Останавливаем любую текущую скорость игрока, чтобы начать чистое перетаскивание
      (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
    } else {
      // Клик/касание В СТОРОНЕ от игрока: применяем направленный рывок
      this.isDraggingPlayer = false; // Убеждаемся, что режим перетаскивания неактивен
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      if (playerBody) {
        if (pointer.x < this.player.x) { // Тап слева от игрока
          playerBody.setVelocityX(-PLAYER_SPEED * 1.5); // Рывок влево
        } else { // Тап справа от игрока
          playerBody.setVelocityX(PLAYER_SPEED * 1.5); // Рывок вправо
        }
        // Останавливаем рывок через короткое время, если пользователь не начал перетаскивание
        this.time.delayedCall(100, () => {
          // Проверяем, что указатель не зажат (чтобы не конфликтовать с возможным перетаскиванием)
          // и что мы не в режиме перетаскивания игрока
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

    if (this.isDraggingPlayer && pointer.isDown) { // Перемещаем игрока только если активно перетаскивание и указатель зажат
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      if (playerBody) {
        // Перемещаем игрока относительно начальной позиции перетаскивания
        const newPlayerX = this.dragPlayerStartX + (pointer.x - this.dragStartX);
        this.player.x = Phaser.Math.Clamp(newPlayerX, PLAYER_SIZE / 2, this.scale.width - PLAYER_SIZE / 2);
        playerBody.setVelocityX(0); // Обнуляем скорость при перетаскивании
      }
    }
  }

  private onScenePointerUp(): void {
    if (this.gameOver) {
      return;
    }
    // Сбрасываем флаг перетаскивания при отпускании указателя
    this.isDraggingPlayer = false;
    // Останавливаем движение игрока, если оно было (например, после рывка)
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

  // НОВАЯ ЛОГИКА ГЕНЕРАЦИИ ПРЕПЯТСТВИЙ (две части с проходом)
  private spawnObstacle(): void {
    if (this.gameOver) {
      return;
    }

    // Получаем два препятствия из пула (для левой и правой части)
    const leftObstacle = this.getPooledObstacle();
    const rightObstacle = this.getPooledObstacle();

    // Убедимся, что оба препятствия доступны из пула
    if (leftObstacle && rightObstacle && leftObstacle.body && rightObstacle.body) {
      // Вычисляем случайную X-позицию для начала ПРОХОДА (дырки)
      // Проход может начаться от X=0 до (ширина экрана - ширина самого прохода)
      const gapX = Phaser.Math.Between(0, this.scale.width - MIN_OPENING_WIDTH);

      // 1. Левая часть препятствия
      const leftWidth = gapX; // Ширина левой части равна X-координате начала прохода
      leftObstacle.x = 0; // Начинается от левого края экрана
      leftObstacle.y = -OBSTACLE_HEIGHT; // Появляется над экраном
      leftObstacle.displayWidth = leftWidth;
      leftObstacle.displayHeight = OBSTACLE_HEIGHT;
      leftObstacle.body.setSize(leftObstacle.displayWidth, leftObstacle.displayHeight); // Устанавливаем размер физического тела
      leftObstacle.body.setOffset(0, 0); // Сброс смещения тела
      leftObstacle.body.setAllowGravity(false);
      leftObstacle.body.setVelocityY(OBSTACLE_SPEED);

      // 2. Правая часть препятствия
      // X-позиция правой части = начало прохода + ширина прохода
      const rightX = gapX + MIN_OPENING_WIDTH;
      // Ширина правой части = (ширина экрана) - (начало правой части)
      const rightWidth = this.scale.width - rightX;
      rightObstacle.x = rightX; // Начинается после прохода
      rightObstacle.y = -OBSTACLE_HEIGHT; // Появляется над экраном
      rightObstacle.displayWidth = rightWidth;
      rightObstacle.displayHeight = OBSTACLE_HEIGHT;
      rightObstacle.body.setSize(rightObstacle.displayWidth, rightObstacle.displayHeight); // Устанавливаем размер физического тела
      rightObstacle.body.setOffset(0, 0); // Сброс смещения тела
      rightObstacle.body.setAllowGravity(false);
      rightObstacle.body.setVelocityY(OBSTACLE_SPEED);
    }
  }

  private hitObstacle(): void {
    this.gameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000); // Покрасить игрока в красный
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `Игра окончена!\nСчет: ${this.score}\nНажмите для перезапуска`,
      { fontSize: "48px",
        color: "#ff0000",
        align: "center" },
    ).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.restart();
    });
    this.input.keyboard?.once("keydown-SPACE", () => {
      this.scene.restart();
    });
  }
}
