import { Scene } from "phaser";
import { createTiledBackground, getAssetsPath, getAssetsPathByType } from "$/utils";
import type { MoveSceneData } from "@core/state";
import { ThoughtBubble } from "../../components/thought-bubble/thought-bubble";

const GROUND_HEIGHT = 50;

interface Question {
  id: string;
  text: string;
  options: { text: string;
    value: string }[];
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
  private _background!: Phaser.GameObjects.TileSprite;
  private targetX: number | null = null;
  private targetY: number | null = null;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  private thoughtBubble: ThoughtBubble | null = null;

  private questionsMap = new Map<string, Question>();
  private currentQuestionId: string | null = null;

  constructor() {
    super("MoveScene");
  }

  init(data: MoveSceneData): void {
    this.targetX = data.targetX;
    this.targetY = data.targetY;
    console.log(`MoveScene initialized with target: X=${this.targetX}, Y=${this.targetY}`);
  }

  preload(): void {
    for (let i = 1; i <= 20; i++) {
      const assetKey = `player_frame_${i}`;
      const filename = `hero/${i}.svg`;

      this.load.svg(assetKey, getAssetsPathByType({
        type: "images",
        filename: filename,
      }),
      { width: 241,
        height: 414 },
      );
    }

    this.load.image("move/background", getAssetsPath("images/background-variant.png"));
    this.load.image("ground", getAssetsPath("images/platform.png"));

    this.load.json("questionsData", getAssetsPath("data/questions.json"));
  }

  create(): void {
    const { width, height } = this.sys.game.canvas;

    this._background = createTiledBackground(this, "move/background");
    const scaleY = height / this._background.height;
    this._background.setScale(scaleY);

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
      "player_frame_1",
    );
    this.player
      .setOrigin(0.5, 1)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setGravityY(500);

    this.player.body?.setSize(241, 414);
    this.player.setDepth(2000);

    const walkFrames = [];
    for (let i = 1; i <= 20; i++) {
      walkFrames.push({ key: `player_frame_${i}` });
    }

    this.anims.create({
      key: "walk",
      frames: walkFrames,
      frameRate: 40,
      repeat: -1,
    });

    const idleFrames = [
      { key: "player_frame_1" },
    ];

    this.anims.create({
      key: "idle",
      frames: idleFrames,
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

    this.scale.on("resize", this.resizeGame.bind(this));

    const questionsJson: QuestionsJson = this.cache.json.get("questionsData") as QuestionsJson;
    if (questionsJson && questionsJson.questions) {
      questionsJson.questions.forEach((q: Question) => this.questionsMap.set(q.id, q));
    } else {
      console.error("Failed to load questions data or questions array is missing. Using default.");
      this.questionsMap.set("default", {
        id: "default",
        text: "Извините, вопросы не загрузились.",
        options: [{ text: "Хорошо",
          value: "ok" }],
        nextQuestionId: null,
      });
    }

    this.thoughtBubble = new ThoughtBubble(this, this.player.x, this.player.y - (this.player.height * this.player.scaleY) * 0.7, "", []);

    if (this.thoughtBubble) {
      this.thoughtBubble.onOptionSelected.on("selected", (selectedValue: string) => {
        console.log(`Игрок выбрал: ${selectedValue}`);
        const resultText = this.add.text(
          this.player.x,
          this.player.y - (this.player.height * this.player.scaleY) - 250,
          `Вы выбрали: ${selectedValue}`,
          { fontSize: "18px",
            color: "#ffff00" },
        ).setOrigin(0.5)
          .setDepth(20);

        this.time.delayedCall(3000, () => {
          resultText.destroy();
        });

        if (this.currentQuestionId) {
          const currentQuestion = this.questionsMap.get(this.currentQuestionId);
          if (currentQuestion && currentQuestion.nextQuestionId) {
            const nextId = currentQuestion.nextQuestionId[selectedValue];
            if (nextId) {
              this.time.delayedCall(1500, () => this.presentQuestion(nextId), [], this);
            } else {
              console.log("Нет следующего вопроса для этого варианта. Разговор завершен.");
              this.thoughtBubble?.hide();
            }
          } else {
            console.log("Определение следующего вопроса отсутствует. Разговор завершен.");
            this.thoughtBubble?.hide();
          }
        }
      });
    }

    this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.presentQuestion("q1");
      },
      callbackScope: this,
      loop: false,
    });

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const { width } = this.sys.game.canvas;
      if (pointer.x < width / 2) {
        this.moveLeft = true;
        this.moveRight = false;
      } else if (pointer.x > width / 2) {
        this.moveRight = true;
        this.moveLeft = false;
      }
    });

    this.input.on("pointerup", () => {
      this.moveLeft = false;
      this.moveRight = false;
    });
  }

  resizeGame(gameSize: { width: number;
    height: number }) {
    const { width, height } = gameSize;
    console.log("gamesize width, height: ", width, height);

    if (this._background) {
      this._background.displayWidth = width;
      this._background.displayHeight = height;
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

  update(_time: number, _delta: number): void {
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

      this._background.tilePositionX += this.player.body.velocity.x * speedFactor * this.game.loop.delta / 1000;
    }

    if (this.player && this.thoughtBubble) {
      this.thoughtBubble.setPosition(this.player.x, this.player.y - (this.player.height * this.player.scaleY) * 1.2);
    }
  }

  private presentQuestion(questionId: string): void {
    const question = this.questionsMap.get(questionId);
    if (question && this.thoughtBubble) {
      this.currentQuestionId = questionId;
      this.thoughtBubble.updateContent(question.text, question.options);
      this.thoughtBubble.show();
    } else {
      console.warn(`Question with ID "${questionId}" not found or thoughtBubble not initialized. Ending conversation.`);
      this.thoughtBubble?.hide();
    }
  }
}
