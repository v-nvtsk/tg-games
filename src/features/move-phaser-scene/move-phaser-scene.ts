import { Scene } from "phaser";
import { createTiledBackground, getAssetsPath, getAssetsPathByType } from "$/utils";
import type { MoveSceneData } from "@core/types/common-types";
import { useMoveSceneStore } from "$/core/state/move-scene-store"; // Новый стор для MoveSceneWrapper
import { gameFlowManager } from "$/processes"; // Для перехода на FlyingGameScene

// --- Константы для лучшей читаемости и управления ---
const GROUND_HEIGHT = 50;
const PLAYER_GRAVITY = 500;
const PLAYER_BOUNCE = 0.2;
const PLAYER_SPEED = 150;
const PLAYER_FRAME_RATE = 16;
const NUM_PLAYER_FRAMES = 15;
const NUM_START_FRAMES = 7; // Количество кадров для фазы начала движения

const PARALLAX_FACTORS = {
  background: 0.1,
  preBackground: 0.3,
  light: 0.6,
  front: 1.0,
};

// --- Типы данных (в идеале, вынести в отдельный файл, например, src/core/types/game-types.ts) ---
export interface Question { // Экспортируем, так как будет использоваться в React
  id: string;
  text: string;
  options: {
    text: string;
    value: string
  }[];
  nextQuestionId: Record<string, string | null> | null;
}

interface QuestionsJson {
  questions: Question[];
}

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

  private questionsMap = new Map<string, Question>();
  private currentQuestionId: string | null = null;

  constructor() {
    super("MoveScene");
  }

  init(data: MoveSceneData): void {
    this.targetX = data?.targetX ?? 0;
  }

  preload(): void {
    // Загружаем кадры для фазы начала движения (start_1 - start_9)
    for (let i = 1; i <= NUM_START_FRAMES; i++) {
      const assetKey = `player_start_${i}`;
      const filename = `alex/start_${i}.png`;

      this.load.image(assetKey, getAssetsPathByType({
        type: "images",
        filename: filename,
      }));
    }

    // Загружаем кадры для фазы движения (cycle_1 - cycle_15)
    for (let i = 1; i <= NUM_PLAYER_FRAMES; i++) {
      const assetKey = `player_cycle_${i}`;
      const filename = `alex/cycle_${i}.png`;

      this.load.image(assetKey, getAssetsPathByType({
        type: "images",
        filename: filename,
      }));
    }

    // Загрузка ресурсов в порядке их отрисовки (от заднего плана к переднему)
    this.load.image("parallax/background", getAssetsPathByType({ // Самый дальний фон
      type: "images",
      scene: "move",
      filename: "background.svg",
    }));

    this.load.image("parallax/pre-background", getAssetsPathByType({ // Фон перед самым дальним
      type: "images",
      scene: "move",
      filename: "pre-background.svg",
    }));

    this.load.image("parallax/light", getAssetsPathByType({ // Слой света
      type: "images",
      scene: "move",
      filename: "light.svg",
    }));

    this.load.image("parallax/front", getAssetsPathByType({ // Передний план, самый близкий к игроку
      type: "images",
      scene: "move",
      filename: "front.svg",
    }));

    this.load.image("ground", getAssetsPath("images/platform.png"));

    this.load.json("questionsData", getAssetsPath("data/questions.json"));
    console.log("MoveScene: preload() - Загрузка questions.json началась.");
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    this.createParallaxLayers(width, height);
    this.createPlatforms();
    this.createPlayer();
    this.createAnimations();
    this.setupInputHandling();
    this.setupCamera();
    this.loadQuestions(); // Вызываем здесь, чтобы заполнить questionsMap

    console.log("MoveScene: create() - Карта вопросов загружена. Размер:", this.questionsMap.size);
    if (this.questionsMap.size === 0) {
      console.error("MoveScene: questionsMap пуста! Проверьте questions.json и метод loadQuestions.");
    }

    // Коллизии
    this.physics.add.collider(this.player, this.platforms);

    // Обработка изменения размера
    this.scale.on("resize", this.handleResize, this);

    // Запускаем первый вопрос через 5 секунд
    console.log("MoveScene: create() - Устанавливаем таймер для q1.");
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        console.log("MoveScene: Таймер сработал, пытаемся представить q1.");
        this.presentQuestion("q1");
      },
      callbackScope: this,
      loop: false,
    });

    // Подписываемся на события выбора опции из React ThoughtBubble
    useMoveSceneStore.getState().onOptionSelected.addListener("optionSelected", this.handleQuestionOptionSelected, this);
  }

  // Очистка слушателя при остановке сцены
  destroy(): void {
    // Используем стрелочную функцию для handleQuestionOptionSelected, чтобы избежать проблем с привязкой this
    useMoveSceneStore.getState().onOptionSelected.removeListener("optionSelected", this.handleQuestionOptionSelected, this);
  }

  // Метод для обработки изменения размеров сцены
  // Преобразован в стрелочную функцию для автоматической привязки this
  private handleResize = (gameSize: Phaser.Structs.Size): void => {
    const { width, height } = gameSize;

    this.resizeParallaxLayers(width, height);

    if (this.platforms && this.platforms.getChildren().length > 0) {
      const platform = this.platforms.getChildren()[0] as Phaser.Physics.Arcade.Sprite;
      this.resizePlatform(platform, width, height);
      platform.refreshBody();
    }

    if (this.player) {
      this.player.setX(this.targetX || width / 2);
      this.player.setY(height - GROUND_HEIGHT);
    }

    this.cameras.main.setSize(width, height);
    this.cameras.main.setDeadzone(0, 0);
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
    platform
      .setOrigin(0.5, 0.5)
      .setDepth(-1000)
      .setBounce(0)
      .setImmovable(true)
      .setAlpha(0);

    this.resizePlatform(platform, width, height);
    platform.refreshBody();
  }

  private createPlayer(): void {
    const { width, height } = this.sys.game.canvas;
    this.player = this.physics.add.sprite(this.targetX || width / 2, height, "player_start_1");
    this.player
      .setOrigin(0.5, 1)
      .setCollideWorldBounds(true)
      .setBounce(PLAYER_BOUNCE)
      .setGravityY(PLAYER_GRAVITY)
      .setDepth(2) // Игрок выше большинства слоев, но ниже самого переднего плана
      .setFrame("player_start_1");
  }

  private createAnimations(): void {
    this.anims.create({
      key: "idle",
      frames: [{ key: "player_start_1" }],
      frameRate: PLAYER_FRAME_RATE,
      repeat: 0,
    });

    // Анимация начала движения (start_2 - start_7)
    const startFrames = Array.from({ length: NUM_START_FRAMES }, (_, i) => ({
      key: `player_start_${i + 1}`,
    }));

    this.anims.create({
      key: "start_walking",
      frames: startFrames,
      frameRate: PLAYER_FRAME_RATE,
      repeat: 0, // Не повторяем, так как это переходная анимация
    });

    // Анимация движения (cycle_1 - cycle_15)
    const walkFrames = Array.from({ length: NUM_PLAYER_FRAMES }, (_, i) => ({
      key: `player_cycle_${i + 1}`,
    }));

    this.anims.create({
      key: "walk",
      frames: walkFrames,
      frameRate: PLAYER_FRAME_RATE,
      repeat: -1,
    });
  }

  private setupInputHandling(): void {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

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

  private loadQuestions(): void {
    console.log("MoveScene: loadQuestions() - Пытаемся получить вопросы из кэша.");
    const questionsJson: QuestionsJson = this.cache.json.get("questionsData") as QuestionsJson;
    if (questionsJson?.questions) {
      questionsJson.questions.forEach((q: Question) => this.questionsMap.set(q.id, q));
      console.log("MoveScene: loadQuestions() - Вопросы успешно загружены в questionsMap.");
    } else {
      console.error("MoveScene: loadQuestions() - ОШИБКА: Не удалось загрузить данные вопросов или массив 'questions' отсутствует.", questionsJson);
      this.questionsMap.set("default", {
        id: "default",
        text: "Извините, вопросы не загрузились.",
        options: [{
          text: "Хорошо",
          value: "ok",
        }],
        nextQuestionId: null,
      });
    }
  }

  // Метод для обработки выбора опции вопроса
  // Преобразован в стрелочную функцию для автоматической привязки this
  private handleQuestionOptionSelected = (selectedValue: string): void => {
    // ... (существующая логика выбора вопроса)

    if (this.currentQuestionId) {
      const currentQuestion = this.questionsMap.get(this.currentQuestionId);
      const nextId = currentQuestion?.nextQuestionId?.[selectedValue];

      if (nextId) {
        this.time.delayedCall(1500, () => this.presentQuestion(nextId), [], this);
      } else {
        console.log("Разговор завершен. Запускаем FlyingGameScene...");
        useMoveSceneStore.getState().hideThoughtBubble(); // Скрываем пузырь

        // --- ДОБАВЛЕННЫЕ УЛУЧШЕНИЯ ДЛЯ ПЕРЕХОДА ---
        // 1. Добавить эффект затемнения/затухания
        const blackOverlay = this.add.rectangle(
          this.scale.width / 2,
          this.scale.height / 2,
          this.scale.width,
          this.scale.height,
          0x000000,
        ).setAlpha(0)
          .setDepth(1000); // Глубина, чтобы быть поверх всего

        this.tweens.add({
          targets: blackOverlay,
          alpha: 1, // Полностью затемнить
          duration: 500, // За 0.5 секунды
          onComplete: () => {
            // Только после затемнения вызываем переход
            gameFlowManager.showFlyingGame();
            // Опционально: можно добавить текст "Загрузка..." перед затемнением
            // this.add.text(this.scale.width / 2, this.scale.height / 2, 'Загрузка...', { fontSize: '48px', color: '#fff' }).setOrigin(0.5).setDepth(1001);
          },
        });
        // --- КОНЕЦ ДОБАВЛЕННЫХ УЛУЧШЕНИЙ ---
      }
    }
  };

  // Метод для обработки изменения размеров параллакс-слоев
  private resizeParallaxLayers(width: number, height: number): void {
    const layers = [
      this.parallaxBackground,
      this.parallaxPreBackground,
      this.parallaxLight,
      this.parallaxFront,
    ];

    layers.forEach((layer) => {
      if (layer) {
        layer.displayWidth = width;
        layer.displayHeight = height; // Растягиваем на всю высоту
      }
    });
  }

  private resizePlatform(platform: Phaser.Physics.Arcade.Sprite, width: number, height: number): void {
    platform.setX(width / 2);
    platform.setY(height);
    platform.setOrigin(0.5, 0.5);
    platform.displayWidth = width * 2;
    platform.displayHeight = GROUND_HEIGHT * 1.5;
  }

  resizeGame(gameSize: {
    width: number;
    height: number
  }) {
    const { width, height } = gameSize;

    this.resizeParallaxLayers(width, height);

    if (this.platforms && this.platforms.getChildren().length > 0) {
      const platform = this.platforms.getChildren()[0] as Phaser.Physics.Arcade.Sprite;
      this.resizePlatform(platform, width, height);
      platform.refreshBody();
    }

    if (this.player) {
      this.player.setX(this.targetX || width / 2);
      this.player.setY(height - GROUND_HEIGHT);
    }

    this.cameras.main.setSize(width, height);
    this.cameras.main.setDeadzone(0, 0);
  }

  update(_time: number, _delta: number): void {
    if (!this.player || !this.player.body) return;

    const onGround = this.player.body.touching.down;
    if (onGround) {
      this.player.setVelocityY(0);
    }

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
      const baseSpeedFactor = this.player.body.velocity.x * this.game.loop.delta / 1000;
      if (this.parallaxBackground) {
        this.parallaxBackground.tilePositionX += baseSpeedFactor * PARALLAX_FACTORS.background;
      }
      if (this.parallaxPreBackground) {
        this.parallaxPreBackground.tilePositionX += baseSpeedFactor * PARALLAX_FACTORS.preBackground;
      }
      if (this.parallaxLight) {
        this.parallaxLight.tilePositionX += baseSpeedFactor * PARALLAX_FACTORS.light;
      }
      if (this.parallaxFront) {
        this.parallaxFront.tilePositionX += baseSpeedFactor * PARALLAX_FACTORS.front;
      }
    }

    // Обновляем позицию ThoughtBubble через стор
    useMoveSceneStore.getState().setThoughtBubblePosition({
      x: this.player.x,
      y: this.player.y - (this.player.height * this.player.scaleY) * 1.2,
    });
  }

  private handleMovementState(isMoving: boolean): void {
    // Если персонаж начал двигаться
    if (isMoving && !this.isMoving) {
      this.isMoving = true;

      // Начинаем с анимации начала движения
      this.player.play("start_walking", true);

      // После завершения анимации начала движения переходим к цикличному движению
      this.player.once("animationcomplete", () => {
        if (this.isMoving) {
          this.player.play("walk", true);
        }
      }, this);
    }
    // Если персонаж остановился
    else if (!isMoving && this.isMoving) {
      this.isMoving = false;
      this.player.play("idle", true);
    }
  }

  private presentQuestion(questionId: string): void {
    console.log("MoveScene: presentQuestion() - Вызван для ID:", questionId);
    const question = this.questionsMap.get(questionId);
    if (question) {
      this.currentQuestionId = questionId;
      console.log("MoveScene: presentQuestion() - Отображаем пузырь с сообщением:", question.text);
      useMoveSceneStore.getState().showThoughtBubble(question.text, question.options);
    } else {
      console.warn(`MoveScene: presentQuestion() - Вопрос с ID "${questionId}" не найден. Завершаем разговор.`);
      useMoveSceneStore.getState().hideThoughtBubble();
    }
  }
}
